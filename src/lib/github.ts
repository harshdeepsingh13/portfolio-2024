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
