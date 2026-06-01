import type { BlogPost, BlogPostPreview } from "@/types/blog";

export const BLOG_POSTS_API = {
  list: "/api/blog/posts",
  listAll: "/api/blog/posts?all=true",
  byId: (id: string) => `/api/blog/posts/${id}`,
};

export async function listAllPosts(): Promise<BlogPostPreview[]> {
  const res = await fetch(BLOG_POSTS_API.listAll);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function getPost(id: string): Promise<BlogPost> {
  const res = await fetch(BLOG_POSTS_API.byId(id));
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function createPost(payload: Record<string, unknown>): Promise<{ _id: string }> {
  const res = await fetch(BLOG_POSTS_API.list, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`);
  }
  return res.json();
}

export async function updatePost(
  id: string,
  payload: Record<string, unknown>
): Promise<BlogPost> {
  const res = await fetch(BLOG_POSTS_API.byId(id), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`);
  }
  return res.json();
}

export async function deletePost(id: string): Promise<void> {
  const res = await fetch(BLOG_POSTS_API.byId(id), { method: "DELETE" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}
