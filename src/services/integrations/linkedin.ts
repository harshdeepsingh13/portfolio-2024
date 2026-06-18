export interface LinkedInStatus {
  connected: boolean;
  expired: boolean;
  displayName?: string;
  expiresAt?: string;
}

export type LinkPlacement = "card" | "comment";

export interface ShareToLinkedInResult {
  url: string;
  linkedInId: string;
}

/** Error carrying the API's machine code (e.g. "not_connected" | "expired"). */
export class ShareError extends Error {
  code?: string;
  status: number;
  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ShareError";
    this.status = status;
    this.code = code;
  }
}

export const LINKEDIN_API = {
  status: "/api/integrations/linkedin/status",
  connect: "/api/integrations/linkedin/connect",
  disconnect: "/api/integrations/linkedin/disconnect",
  share: (id: string) => `/api/blog/posts/${id}/linkedin`,
};

export async function getLinkedInStatus(): Promise<LinkedInStatus> {
  const res = await fetch(LINKEDIN_API.status);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function disconnectLinkedIn(): Promise<void> {
  const res = await fetch(LINKEDIN_API.disconnect, { method: "POST" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

export async function shareToLinkedIn(
  id: string,
  payload: { commentary: string; linkPlacement: LinkPlacement },
): Promise<ShareToLinkedInResult> {
  const res = await fetch(LINKEDIN_API.share(id), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string; code?: string };
    throw new ShareError(body.error ?? `HTTP ${res.status}`, res.status, body.code);
  }
  return res.json();
}
