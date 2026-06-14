import "server-only";
import { marked } from "marked";
import { sanitizeHtml } from "./sanitize";

interface GitHubStats {
  repos: number;
  commits: number;
  linesOfCode: number;
}

export async function getGitHubStats(): Promise<GitHubStats> {
  const username = process.env.GITHUB_USERNAME;
  const token = process.env.GITHUB_TOKEN;

  if (!username) return { repos: 0, commits: 0, linesOfCode: 0 };

  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    const [userRes, reposRes, commitsRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, { headers }),
      fetch(`https://api.github.com/users/${username}/repos?per_page=100&type=owner`, { headers }),
      fetch(`https://api.github.com/search/commits?q=author:${username}&per_page=1`, { headers }),
    ]);

    const [userData, reposData, commitsData] = await Promise.all([
      userRes.json(),
      reposRes.json(),
      commitsRes.json(),
    ]);

    const repos: number = userData?.public_repos ?? 0;
    const commits: number = commitsData?.total_count ?? 0;

    const repoList = Array.isArray(reposData) ? reposData : [];

    const languageResults = await Promise.all(
      repoList.map((repo: { full_name: string }) =>
        fetch(`https://api.github.com/repos/${repo.full_name}/languages`, { headers })
          .then((r) => r.json())
          .catch(() => ({}))
      )
    );

    const totalBytes = languageResults.reduce((sum, langMap) => {
      const bytes = Object.values(langMap as Record<string, number>).reduce((s, v) => s + v, 0);
      return sum + bytes;
    }, 0);

    const linesOfCode = Math.round(totalBytes / 35 / 1000);

    return { repos, commits, linesOfCode };
  } catch {
    return { repos: 0, commits: 0, linesOfCode: 0 };
  }
}

// ---------------------------------------------------------------------------
// README fetch + render — powers the per-project case-study pages.
// Fetches a repo's README via the GitHub API (cached hourly), converts
// markdown → HTML, demotes README headings so the page keeps a single H1,
// rewrites relative links/images to absolute GitHub URLs, and sanitizes
// the result (XSS + code highlighting) via the shared sanitizer.
// ---------------------------------------------------------------------------

// Minimum visible README text length for a project to earn a case-study page.
export const README_MIN_CHARS = 300;

export interface ReadmeResult {
  html: string;
  textLength: number;
  readmeLastModified: string | null;
}

/**
 * Extract `{ owner, repo }` from a github.com URL.
 * Tolerates trailing slashes, `.git`, and extra path segments.
 * Returns null for non-GitHub or unparseable links.
 */
export function parseRepo(link?: string | null): { owner: string; repo: string } | null {
  if (!link || typeof link !== "string") return null;
  try {
    const url = new URL(link.trim());
    const host = url.hostname.toLowerCase();
    if (host !== "github.com" && host !== "www.github.com") return null;
    const parts = url.pathname.split("/").filter(Boolean);
    if (parts.length < 2) return null;
    const owner = parts[0];
    const repo = parts[1].replace(/\.git$/i, "");
    if (!owner || !repo) return null;
    return { owner, repo };
  } catch {
    return null;
  }
}

function readmeHeaders(): HeadersInit {
  const token = process.env.GITHUB_TOKEN;
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

/** Demote every README heading one level (h1→h2 … h5→h6, h6 stays) so the page
 *  has a single H1 (its own title) and README headings don't compete with it. */
function demoteHeadings(html: string): string {
  return html.replace(
    /<(\/?)(h)([1-5])([^>]*)>/gi,
    (_m, slash: string, _h: string, level: string, attrs: string) =>
      `<${slash}h${Number(level) + 1}${attrs}>`,
  );
}

function isAbsoluteUrl(url: string): boolean {
  return (
    /^[a-z][a-z0-9+.-]*:/i.test(url) || // protocol (https:, mailto:, data:, …)
    url.startsWith("//") ||
    url.startsWith("#")
  );
}

function resolveAgainst(base: string, rel: string): string {
  try {
    return new URL(rel, base).href;
  } catch {
    return rel;
  }
}

/** Derive raw/blob base URLs (with the real default branch) from the readme
 *  response's download_url, e.g.
 *  https://raw.githubusercontent.com/owner/repo/main/docs/README.md */
function deriveBases(
  downloadUrl: string | undefined,
  repo: { owner: string; repo: string },
): { rawBase: string; blobBase: string } {
  let branch = "HEAD";
  let dir = "";
  if (downloadUrl) {
    try {
      const parts = new URL(downloadUrl).pathname.split("/").filter(Boolean);
      // [owner, repo, branch, ...path, filename]
      branch = parts[2] || "HEAD";
      const dirParts = parts.slice(3, -1);
      dir = dirParts.length ? `${dirParts.join("/")}/` : "";
    } catch {
      /* fall back to HEAD */
    }
  }
  return {
    rawBase: `https://raw.githubusercontent.com/${repo.owner}/${repo.repo}/${branch}/${dir}`,
    blobBase: `https://github.com/${repo.owner}/${repo.repo}/blob/${branch}/${dir}`,
  };
}

/** Rewrite relative <img src> → raw.githubusercontent and relative <a href> →
 *  github.com/blob so README assets/links resolve off-GitHub. */
function rewriteRelativeUrls(html: string, bases: { rawBase: string; blobBase: string }): string {
  html = html.replace(
    /(<img\b[^>]*?\bsrc=)(["'])(.*?)\2/gi,
    (m, pre: string, q: string, url: string) =>
      isAbsoluteUrl(url) ? m : `${pre}${q}${resolveAgainst(bases.rawBase, url)}${q}`,
  );
  html = html.replace(
    /(<a\b[^>]*?\bhref=)(["'])(.*?)\2/gi,
    (m, pre: string, q: string, url: string) =>
      isAbsoluteUrl(url) ? m : `${pre}${q}${resolveAgainst(bases.blobBase, url)}${q}`,
  );
  return html;
}

/**
 * Fetch + render a repo's README as sanitized HTML. Returns null on any failure
 * (non-GitHub link, 404, network error) so callers degrade gracefully.
 */
export async function fetchReadmeHtml(link?: string | null): Promise<ReadmeResult | null> {
  const repo = parseRepo(link);
  if (!repo) return null;

  try {
    const res = await fetch(
      `https://api.github.com/repos/${repo.owner}/${repo.repo}/readme`,
      { headers: readmeHeaders(), next: { revalidate: 3600 } },
    );
    if (!res.ok) return null;

    const readmeLastModified = res.headers.get("last-modified");
    const json = (await res.json()) as {
      content?: string;
      encoding?: string;
      download_url?: string;
    };
    if (!json.content) return null;

    const markdown = Buffer.from(
      json.content,
      (json.encoding as BufferEncoding) || "base64",
    ).toString("utf-8");
    if (!markdown.trim()) return null;

    let html = await marked.parse(markdown, { gfm: true });
    html = demoteHeadings(html);
    html = rewriteRelativeUrls(html, deriveBases(json.download_url, repo));

    const clean = await sanitizeHtml(html);
    const textLength = clean
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim().length;

    return { html: clean, textLength, readmeLastModified };
  } catch {
    return null;
  }
}
