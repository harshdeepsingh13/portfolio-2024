// ---------------------------------------------------------------------------
// LinkedIn integration service (framework-agnostic).
//
// Implements a *member feed share* via LinkedIn's official Posts API — the only
// sanctioned way to publish to a personal profile programmatically. We post
// short commentary + the canonical blog URL, which LinkedIn unfurls into a card
// from the blog page's OpenGraph tags. No scraping, no unofficial endpoints.
//
// All functions are plain (no req/res). Failures throw Error with `.status` set
// so route handlers can translate them into the right HTTP response.
// ---------------------------------------------------------------------------

import type { Connection } from "mongoose";
import { connectToBlogsDB } from "@/lib/mongoose";
import { linkedInIntegrationSchema } from "../../modals/linkedInIntegration";

const AUTHORIZE_URL = "https://www.linkedin.com/oauth/v2/authorization";
const TOKEN_URL = "https://www.linkedin.com/oauth/v2/accessToken";
const USERINFO_URL = "https://api.linkedin.com/v2/userinfo";
const POSTS_URL = "https://api.linkedin.com/rest/posts";
const IMAGES_URL = "https://api.linkedin.com/rest/images";

// openid + profile → identify the member (person URN via /userinfo)
// w_member_social → create posts on the member's behalf
const SCOPE = "openid profile w_member_social";

// ── Typed errors ────────────────────────────────────────────────────────────

export class LinkedInError extends Error {
  status: number;
  constructor(message: string, status = 500) {
    super(message);
    this.name = "LinkedInError";
    this.status = status;
  }
}

// ── Config ──────────────────────────────────────────────────────────────────

interface LinkedInConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  apiVersion: string;
}

/** Reads + validates LinkedIn env config. Throws 500 if anything is missing. */
export function getLinkedInConfig(): LinkedInConfig {
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
  const redirectUri = process.env.LINKEDIN_REDIRECT_URI;
  const apiVersion = process.env.LINKEDIN_API_VERSION || "202605";

  if (!clientId || !clientSecret || !redirectUri) {
    throw new LinkedInError(
      "LinkedIn is not configured. Set LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET and LINKEDIN_REDIRECT_URI in .env.",
      500,
    );
  }
  return { clientId, clientSecret, redirectUri, apiVersion };
}

/** The single owner key for the connection document. */
function ownerKey(): string {
  return process.env.UESR_EMAIL || "owner";
}

// ── OAuth ───────────────────────────────────────────────────────────────────

export function buildAuthorizeUrl(state: string): string {
  const { clientId, redirectUri } = getLinkedInConfig();
  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: SCOPE,
    state,
  });
  return `${AUTHORIZE_URL}?${params.toString()}`;
}

interface TokenResponse {
  access_token: string;
  expires_in: number; // seconds (~60 days)
  scope?: string;
}

export async function exchangeCodeForToken(code: string): Promise<TokenResponse> {
  const { clientId, clientSecret, redirectUri } = getLinkedInConfig();
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
  });

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new LinkedInError(`LinkedIn token exchange failed (${res.status}): ${detail}`, 502);
  }
  return (await res.json()) as TokenResponse;
}

interface UserInfo {
  sub: string;
  name?: string;
}

export async function fetchUserInfo(accessToken: string): Promise<UserInfo> {
  const res = await fetch(USERINFO_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new LinkedInError(`Failed to fetch LinkedIn profile (${res.status}): ${detail}`, 502);
  }
  return (await res.json()) as UserInfo;
}

// ── Connection persistence (blogs DB) ───────────────────────────────────────

interface ConnectionDoc {
  owner: string;
  accessToken: string;
  personUrn: string;
  displayName?: string;
  scope?: string;
  expiresAt: Date;
  connectedAt?: Date;
}

async function getModel() {
  const conn: Connection = await connectToBlogsDB();
  return (
    conn.models.linkedInIntegration ||
    conn.model("linkedInIntegration", linkedInIntegrationSchema)
  );
}

export async function saveConnection(input: {
  accessToken: string;
  personUrn: string;
  displayName?: string;
  scope?: string;
  expiresAt: Date;
}): Promise<void> {
  const Model = await getModel();
  await Model.findOneAndUpdate(
    { owner: ownerKey() },
    {
      $set: {
        owner: ownerKey(),
        accessToken: input.accessToken,
        personUrn: input.personUrn,
        displayName: input.displayName,
        scope: input.scope,
        expiresAt: input.expiresAt,
        connectedAt: new Date(),
      },
    },
    { upsert: true, new: true },
  );
}

/** Server-only: returns the full doc including the token. */
export async function getConnectionDoc(): Promise<ConnectionDoc | null> {
  const Model = await getModel();
  return (await Model.findOne({ owner: ownerKey() }).lean()) as ConnectionDoc | null;
}

export async function clearConnection(): Promise<void> {
  const Model = await getModel();
  await Model.deleteOne({ owner: ownerKey() });
}

export interface LinkedInStatus {
  connected: boolean;
  expired: boolean;
  displayName?: string;
  expiresAt?: string;
}

/** Client-safe summary — never exposes the token. */
export async function getConnectionStatus(): Promise<LinkedInStatus> {
  const doc = await getConnectionDoc();
  if (!doc) return { connected: false, expired: false };
  const expired = new Date(doc.expiresAt).getTime() <= Date.now();
  return {
    connected: true,
    expired,
    displayName: doc.displayName,
    expiresAt: new Date(doc.expiresAt).toISOString(),
  };
}

// ── Commentary generation ───────────────────────────────────────────────────

/**
 * LinkedIn's Posts `commentary` field uses an escaped "little text" format:
 * the listed characters must be backslash-escaped or the API rejects the post.
 * We deliberately leave `#` unescaped so `#hashtag` renders as a real hashtag.
 */
export function escapeCommentary(text: string): string {
  return text.replace(/[\\|{}@[\]()<>*_~]/g, (c) => `\\${c}`);
}

function toHashtag(tag: string): string {
  const cleaned = tag.replace(/[^a-zA-Z0-9]/g, "");
  return cleaned ? `#${cleaned}` : "";
}

// Soft, editable nudge that encourages reshares — wider reach means more chances
// for other sites to discover and link to the post (real, dofollow backlinks).
const COMMENTARY_CTA = "♻️ Repost if it helps someone in your network.";

/**
 * Builds a default share text: a hook from excerpt/title + a soft CTA + up to 5
 * hashtags. No raw URL in the body — the link rides in the card or first comment.
 */
export function generateCommentary(post: {
  title: string;
  excerpt?: string;
  tags?: string[];
}): string {
  const hook = (post.excerpt?.trim() || post.title.trim());
  const hashtags = (post.tags ?? [])
    .slice(0, 5)
    .map(toHashtag)
    .filter(Boolean)
    .join(" ");
  const parts = [hook, COMMENTARY_CTA];
  if (hashtags) parts.push(hashtags);
  return parts.join("\n\n");
}

/**
 * Appends UTM campaign params to an outbound share/comment link so GA4 can
 * attribute LinkedIn referral traffic (LinkedIn routes clicks through lnkd.in,
 * which can strip the referrer). Only ever applied to the shared link — never to
 * the page's <link rel=canonical>, which stays clean so Google consolidates.
 */
export function withUtm(url: string, slug?: string): string {
  const campaign = process.env.LINKEDIN_UTM_CAMPAIGN || "blog_share";
  try {
    const u = new URL(url);
    u.searchParams.set("utm_source", "linkedin");
    u.searchParams.set("utm_medium", "social");
    u.searchParams.set("utm_campaign", campaign);
    if (slug) u.searchParams.set("utm_content", slug);
    return u.toString();
  } catch {
    return url;
  }
}

// ── Publishing ──────────────────────────────────────────────────────────────

export interface ShareResult {
  id: string; // share URN, e.g. urn:li:share:123
  url: string; // public feed URL
  thumbnailAttached?: boolean; // only set when a card thumbnail was attempted
}

/** Where the canonical link rides: as the post's article card, or as the first comment. */
export type LinkPlacement = "card" | "comment";

function postHeaders(accessToken: string, apiVersion: string) {
  return {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
    "LinkedIn-Version": apiVersion,
    "X-Restli-Protocol-Version": "2.0.0",
  };
}

/**
 * Adds a comment to an existing share — used by the "link in first comment"
 * strategy. LinkedIn historically throttles reach of posts whose body carries an
 * outbound link, so this keeps the link out of the post body.
 */
export async function addComment(input: {
  accessToken: string;
  personUrn: string;
  shareUrn: string;
  text: string;
  apiVersion: string;
}): Promise<void> {
  const url = `https://api.linkedin.com/rest/socialActions/${encodeURIComponent(input.shareUrn)}/comments`;
  const res = await fetch(url, {
    method: "POST",
    headers: postHeaders(input.accessToken, input.apiVersion),
    body: JSON.stringify({
      actor: input.personUrn,
      object: input.shareUrn,
      message: { text: escapeCommentary(input.text) },
    }),
  });
  if (!res.ok && res.status !== 201) {
    const detail = await res.text().catch(() => "");
    throw new LinkedInError(`LinkedIn rejected the comment (${res.status}): ${detail}`, 502);
  }
}

// Our Unsplash URLs carry `?auto=format`, which can serve WebP — LinkedIn's
// image upload wants JPEG/PNG. Force a JPEG render instead.
function normalizeImageUrl(imageUrl: string): string {
  try {
    const u = new URL(imageUrl);
    if (u.searchParams.has("auto")) {
      u.searchParams.delete("auto");
      u.searchParams.set("fm", "jpg");
    }
    return u.toString();
  } catch {
    return imageUrl;
  }
}

interface InitializeUploadResponse {
  value: { uploadUrl: string; image: string };
}

/** Polls until the uploaded image asset is AVAILABLE — the upload is async. */
async function waitForImageAvailable(
  accessToken: string,
  apiVersion: string,
  imageUrn: string,
): Promise<void> {
  const url = `${IMAGES_URL}/${encodeURIComponent(imageUrn)}`;
  const maxAttempts = 5;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const res = await fetch(url, { headers: postHeaders(accessToken, apiVersion) });
    if (res.ok) {
      const data = (await res.json()) as { status?: string };
      if (data.status === "AVAILABLE") return;
    }
    if (attempt < maxAttempts - 1) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
  throw new LinkedInError(`LinkedIn image ${imageUrn} did not become available in time`, 502);
}

/**
 * Uploads an image to LinkedIn via the Images API (initializeUpload + PUT) and
 * returns the resulting `urn:li:image:{id}` once the asset is AVAILABLE.
 * LinkedIn's Posts API never scrapes OG tags for article posts — the thumbnail
 * must be an asset we've uploaded ourselves.
 */
export async function uploadImage(input: {
  accessToken: string;
  personUrn: string;
  apiVersion: string;
  imageUrl: string;
}): Promise<string> {
  const initRes = await fetch(`${IMAGES_URL}?action=initializeUpload`, {
    method: "POST",
    headers: postHeaders(input.accessToken, input.apiVersion),
    body: JSON.stringify({ initializeUploadRequest: { owner: input.personUrn } }),
  });
  if (!initRes.ok) {
    const detail = await initRes.text().catch(() => "");
    throw new LinkedInError(`LinkedIn image upload init failed (${initRes.status}): ${detail}`, 502);
  }
  const { value } = (await initRes.json()) as InitializeUploadResponse;

  const sourceRes = await fetch(normalizeImageUrl(input.imageUrl));
  if (!sourceRes.ok) {
    throw new LinkedInError(
      `Failed to fetch source image (${sourceRes.status}) from ${input.imageUrl}`,
      502,
    );
  }
  const bytes = await sourceRes.arrayBuffer();

  // Image uploads require an Authorization header on the PUT (video uploads
  // explicitly don't — images do).
  const putRes = await fetch(value.uploadUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${input.accessToken}`,
      "Content-Type": "image/jpeg",
    },
    body: bytes,
  });
  if (!putRes.ok) {
    const detail = await putRes.text().catch(() => "");
    throw new LinkedInError(`LinkedIn image upload PUT failed (${putRes.status}): ${detail}`, 502);
  }

  await waitForImageAvailable(input.accessToken, input.apiVersion, value.image);
  return value.image;
}

export async function shareArticle(input: {
  accessToken: string;
  personUrn: string;
  apiVersion: string;
  commentary: string;
  articleUrl: string;
  title: string;
  description?: string;
  linkPlacement: LinkPlacement;
  thumbnailUrl?: string;
}): Promise<ShareResult> {
  // Best-effort thumbnail upload: a failure here shouldn't block the share
  // itself, but we surface it via `thumbnailAttached` rather than swallowing it.
  let thumbnail: string | undefined;
  let thumbnailAttached: boolean | undefined;
  if (input.linkPlacement === "card" && input.thumbnailUrl) {
    try {
      thumbnail = await uploadImage({
        accessToken: input.accessToken,
        personUrn: input.personUrn,
        apiVersion: input.apiVersion,
        imageUrl: input.thumbnailUrl,
      });
      thumbnailAttached = true;
    } catch (err) {
      console.error("LinkedIn thumbnail upload failed; sharing without an image:", err);
      thumbnailAttached = false;
    }
  }

  const payload = {
    author: input.personUrn,
    commentary: escapeCommentary(input.commentary),
    visibility: "PUBLIC",
    distribution: {
      feedDistribution: "MAIN_FEED",
      targetEntities: [],
      thirdPartyDistributionChannels: [],
    },
    // "card" → attach the article so LinkedIn renders the OG preview.
    // "comment" → text-only post; the link goes in the first comment below.
    ...(input.linkPlacement === "card"
      ? {
          content: {
            article: {
              source: input.articleUrl,
              title: input.title,
              ...(input.description ? { description: input.description } : {}),
              ...(thumbnail ? { thumbnail } : {}),
            },
          },
        }
      : {}),
    lifecycleState: "PUBLISHED",
    isReshareDisabledByAuthor: false,
  };

  const res = await fetch(POSTS_URL, {
    method: "POST",
    headers: postHeaders(input.accessToken, input.apiVersion),
    body: JSON.stringify(payload),
  });

  if (res.status === 401) {
    throw new LinkedInError("LinkedIn token is expired or invalid. Reconnect in Settings.", 401);
  }
  if (!res.ok && res.status !== 201) {
    const detail = await res.text().catch(() => "");
    throw new LinkedInError(`LinkedIn rejected the post (${res.status}): ${detail}`, 502);
  }

  // The created post URN comes back in the x-restli-id response header.
  const id = res.headers.get("x-restli-id") || "";
  const url = id ? `https://www.linkedin.com/feed/update/${id}` : "https://www.linkedin.com/feed/";

  // For the comment strategy, drop the link in as the first comment.
  if (input.linkPlacement === "comment" && id) {
    await addComment({
      accessToken: input.accessToken,
      personUrn: input.personUrn,
      shareUrn: id,
      text: `Read the full post here: ${input.articleUrl}`,
      apiVersion: input.apiVersion,
    });
  }

  return { id, url, ...(thumbnailAttached !== undefined ? { thumbnailAttached } : {}) };
}
