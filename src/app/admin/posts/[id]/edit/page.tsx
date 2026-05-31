"use client";

import BlogEditor from "@/components/BlogEditor";
import type { BlogPost } from "@/types/blog";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { styled, useTheme } from "@mui/material/styles";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

// ── Styled components ─────────────────────────────────────────────────────────

const PageWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  gap: "24px",
  padding: "32px",
  alignItems: "flex-start",

  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    padding: "20px 16px",
  },
}));

const EditorPanel = styled(Box)(() => ({
  flex: 1,
  minWidth: 0,
  display: "flex",
  flexDirection: "column",
  gap: "16px",
}));

const Sidebar = styled(Box)(({ theme }) => ({
  width: "300px",
  flexShrink: 0,
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  position: "sticky",
  top: "24px",

  [theme.breakpoints.down("md")]: {
    width: "100%",
    position: "static",
  },
}));

const SidebarCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: "10px",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  gap: "14px",
}));

const FieldLabel = styled(Typography)(({ theme }) => ({
  fontSize: "0.75rem",
  fontWeight: 600,
  color: theme.palette.custom.accentText,
  textTransform: "uppercase",
  letterSpacing: "0.6px",
  marginBottom: "4px",
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-root": {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
    userSelect: "text",
    WebkitUserSelect: "text",
    fontSize: "0.875rem",
  },
  "& .MuiInputBase-input": {
    userSelect: "text",
    WebkitUserSelect: "text",
    color: theme.palette.text.primary,
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.divider,
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.custom.borderHover,
  },
  "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.primary.main,
  },
}));

// ── Form state type ───────────────────────────────────────────────────────────

interface PostFormState {
  title: string;
  slug: string;
  excerpt: string;
  tags: string;
  coverImage: string;
  seoTitle: string;
  seoDescription: string;
  body_json: Record<string, unknown> | null;
  body_html: string;
}

function buildPayload(form: PostFormState, mode: "save" | "publish") {
  return {
    title: form.title.trim(),
    slug: form.slug.trim(),
    excerpt: form.excerpt.trim() || undefined,
    tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    coverImage: form.coverImage.trim() || undefined,
    body_json: form.body_json,
    body_html: form.body_html,
    seo: {
      metaTitle: form.seoTitle.trim() || undefined,
      metaDescription: form.seoDescription.trim() || undefined,
    },
    readingTime: form.body_html
      ? Math.max(1, Math.round(form.body_html.replace(/<[^>]+>/g, "").split(/\s+/).length / 200))
      : undefined,
    mode,
  };
}

// ── Status indicator ──────────────────────────────────────────────────────────

function StatusIndicator({
  postStatus,
  hasDraft,
}: {
  postStatus: "draft" | "published";
  hasDraft: boolean;
}) {
  const theme = useTheme();

  if (postStatus === "draft") {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Box sx={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: theme.palette.custom.accentText, flexShrink: 0 }} />
        <Typography sx={{ fontSize: "0.8rem", color: theme.palette.custom.accentText }}>
          Draft
        </Typography>
      </Box>
    );
  }

  if (hasDraft) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Box sx={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "warning.main", flexShrink: 0 }} />
        <Typography sx={{ fontSize: "0.8rem", color: "warning.main" }}>
          Published · Unpublished changes
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <Box sx={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "success.main", flexShrink: 0 }} />
      <Typography sx={{ fontSize: "0.8rem", color: "success.main" }}>
        Published · Up to date
      </Typography>
    </Box>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default function EditPostPage({ params }: EditPostPageProps) {
  const router = useRouter();
  const theme = useTheme();

  const [postId, setPostId] = useState<string | null>(null);
  const [form, setForm] = useState<PostFormState | null>(null);
  const [postStatus, setPostStatus] = useState<"draft" | "published">("draft");
  const [hasDraft, setHasDraft] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<string>("");

  // Refs for auto-save (avoid stale closures)
  const formRef = useRef<PostFormState | null>(null);
  const postIdRef = useRef<string | null>(null);
  const postStatusRef = useRef<"draft" | "published">("draft");
  const isDirtyRef = useRef(false);

  // Resolve async params
  useEffect(() => {
    params.then((p) => {
      setPostId(p.id);
      postIdRef.current = p.id;
    });
  }, [params]);

  // Fetch post data
  useEffect(() => {
    if (!postId) return;

    const load = async () => {
      try {
        const res = await fetch(`/api/blog/posts/${postId}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const post: BlogPost = await res.json();

        setPostStatus(post.status);
        setHasDraft(post.hasDraft ?? false);
        postStatusRef.current = post.status;

        // When hasDraft, initialise from draft fields (fall back to root for missing fields)
        const src = post.hasDraft && post.draft
          ? { ...post, ...post.draft }
          : post;

        const loaded: PostFormState = {
          title: src.title ?? "",
          slug: post.slug, // slug always from root
          excerpt: src.excerpt ?? "",
          tags: (src.tags ?? post.tags).join(", "),
          coverImage: src.coverImage ?? "",
          seoTitle: src.seo?.metaTitle ?? "",
          seoDescription: src.seo?.metaDescription ?? "",
          body_json: src.body_json ?? null,
          body_html: src.body_html ?? "",
        };
        setForm(loaded);
        formRef.current = loaded;
        isDirtyRef.current = false;
      } catch {
        setLoadError("Failed to load post. The API may not be available yet.");
      }
    };

    load();
  }, [postId]);

  // Keep formRef in sync with state
  useEffect(() => {
    if (!form) return;
    formRef.current = form;
    isDirtyRef.current = true;
  }, [form]);

  const set = useCallback(<K extends keyof PostFormState>(key: K, value: PostFormState[K]) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  }, []);

  const handleEditorChange = useCallback(
    ({ json, html }: { json: Record<string, unknown>; html: string }) => {
      setForm((prev) => (prev ? { ...prev, body_json: json, body_html: html } : prev));
    },
    []
  );

  // Auto-save (always mode="save", never auto-publishes)
  const autoSave = useCallback(async () => {
    const current = formRef.current;
    const id = postIdRef.current;
    if (!current || !id || !current.title.trim()) return;

    setAutoSaveStatus("Saving…");
    try {
      const res = await fetch(`/api/blog/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload(current, "save")),
      });

      if (res.ok) {
        isDirtyRef.current = false;
        // If the post was published, saving creates an unpublished draft
        if (postStatusRef.current === "published") {
          setHasDraft(true);
        }
        const now = new Date();
        setAutoSaveStatus(
          `Last saved at ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
        );
      } else {
        setAutoSaveStatus("Auto-save failed");
      }
    } catch {
      setAutoSaveStatus("Auto-save failed");
    }
  }, []);

  // 30-second auto-save (start once postId is ready)
  useEffect(() => {
    if (!postId) return;
    const interval = setInterval(autoSave, 30_000);
    return () => clearInterval(interval);
  }, [postId, autoSave]);

  // Warn before browser navigation when dirty
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirtyRef.current) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  // Save in place (mode: "save") — doesn't publish
  const handleSave = async () => {
    if (!form || !postId) return;
    setSaveError(null);

    if (!form.title.trim()) { setSaveError("Title is required."); return; }
    if (!form.slug.trim()) { setSaveError("Slug is required."); return; }

    setSaving(true);
    try {
      const res = await fetch(`/api/blog/posts/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload(form, "save")),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }

      isDirtyRef.current = false;
      if (postStatus === "published") {
        setHasDraft(true);
      }
      const now = new Date();
      setAutoSaveStatus(
        `Last saved at ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
      );
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save post.");
    } finally {
      setSaving(false);
    }
  };

  // Publish (mode: "publish") — promotes to live, navigates away
  const handlePublish = async () => {
    if (!form || !postId) return;
    setSaveError(null);

    if (!form.title.trim()) { setSaveError("Title is required."); return; }
    if (!form.slug.trim()) { setSaveError("Slug is required."); return; }

    setPublishing(true);
    try {
      const res = await fetch(`/api/blog/posts/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload(form, "publish")),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }

      isDirtyRef.current = false;
      router.push("/admin/posts");
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to publish post.");
    } finally {
      setPublishing(false);
    }
  };

  const handlePreview = async () => {
    if (formRef.current?.title.trim()) await autoSave();
    const slug = formRef.current?.slug.trim();
    if (slug) {
      window.open(`/blog/${slug}?preview=1`, "_blank");
    }
  };

  // ── Loading state ─────────────────────────────────────────────────────────
  if (!postId || !form) {
    return (
      <Box sx={{ padding: "40px 32px" }}>
        {loadError ? (
          <Box>
            <Typography sx={{ color: "error.main", marginBottom: "16px" }}>
              {loadError}
            </Typography>
            <Box
              component={Link}
              href="/admin/posts"
              sx={{ color: "primary.main", fontSize: "0.875rem", textDecoration: "underline" }}
            >
              ← Back to posts
            </Box>
          </Box>
        ) : (
          <Typography sx={{ color: "custom.accentText" }}>Loading post…</Typography>
        )}
      </Box>
    );
  }

  // ── Editor ────────────────────────────────────────────────────────────────
  return (
    <PageWrapper>
      {/* ── Left: Editor ───────────────────────────────── */}
      <EditorPanel>
        <Box>
          <Box component={Link} href="/admin/posts" sx={{ fontSize: "0.8rem", color: "primary.main", textDecoration: "none", display: "inline-block", marginBottom: "8px" }}>
            ← Back to posts
          </Box>
          <Typography
            component="h1"
            sx={{ fontSize: "1.5rem", fontWeight: 700, color: "text.primary", marginBottom: "4px" }}
          >
            Edit Post
          </Typography>
        </Box>

        <StyledTextField
          label="Post Title"
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          fullWidth
          required
          slotProps={{ input: { style: { fontSize: "1.1rem", fontWeight: 600 } } }}
        />

        <BlogEditor
          content={form.body_json ?? undefined}
          onChange={handleEditorChange}
          placeholder="Write your post content here…"
        />

        {autoSaveStatus && (
          <Typography
            sx={{ fontSize: "0.75rem", color: "custom.accentText", textAlign: "right" }}
          >
            {autoSaveStatus}
          </Typography>
        )}

        {saveError && (
          <Typography
            sx={{
              fontSize: "0.8rem",
              color: "error.main",
              backgroundColor: "rgba(244,67,54,0.08)",
              border: "1px solid rgba(244,67,54,0.25)",
              borderRadius: "6px",
              padding: "10px 14px",
            }}
          >
            {saveError}
          </Typography>
        )}
      </EditorPanel>

      {/* ── Right: Metadata sidebar ─────────────────────── */}
      <Sidebar>
        <SidebarCard>
          <Typography sx={{ fontWeight: 600, fontSize: "0.9rem", color: "text.primary" }}>
            Publish
          </Typography>

          <StatusIndicator postStatus={postStatus} hasDraft={hasDraft} />

          <Button
            onClick={handleSave}
            disabled={saving || publishing}
            fullWidth
            variant="outlined"
            sx={{
              borderColor: theme.palette.divider,
              color: theme.palette.text.secondary,
              fontWeight: 500,
              textTransform: "none",
              borderRadius: "8px",
              fontSize: "0.875rem",
              "&:hover": { borderColor: theme.palette.custom.borderHover },
            }}
          >
            {saving ? "Saving…" : "Save"}
          </Button>
          <Button
            onClick={handlePublish}
            disabled={publishing || saving}
            fullWidth
            variant="contained"
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.background.default,
              fontWeight: 600,
              textTransform: "none",
              borderRadius: "8px",
              "&:hover": { filter: "brightness(0.9)" },
            }}
          >
            {publishing ? "Publishing…" : "Publish"}
          </Button>
          <Button
            onClick={handlePreview}
            fullWidth
            variant="outlined"
            sx={{
              borderColor: theme.palette.divider,
              color: theme.palette.text.secondary,
              fontWeight: 500,
              textTransform: "none",
              borderRadius: "8px",
              fontSize: "0.85rem",
              "&:hover": { borderColor: theme.palette.custom.borderHover },
            }}
          >
            Preview
          </Button>
        </SidebarCard>

        <SidebarCard>
          <Typography sx={{ fontWeight: 600, fontSize: "0.9rem", color: "text.primary" }}>
            URL
          </Typography>
          <Box>
            <FieldLabel>Slug</FieldLabel>
            <StyledTextField
              value={form.slug}
              onChange={(e) => set("slug", e.target.value)}
              fullWidth
              size="small"
              helperText="Changing the slug will break existing links."
              slotProps={{ formHelperText: { style: { color: theme.palette.custom.accentText, fontSize: "0.7rem" } } }}
            />
          </Box>
        </SidebarCard>

        <SidebarCard>
          <Typography sx={{ fontWeight: 600, fontSize: "0.9rem", color: "text.primary" }}>
            Details
          </Typography>
          <Box>
            <FieldLabel>Excerpt</FieldLabel>
            <StyledTextField
              value={form.excerpt}
              onChange={(e) => set("excerpt", e.target.value)}
              fullWidth
              size="small"
              multiline
              rows={3}
            />
          </Box>
          <Box>
            <FieldLabel>Tags</FieldLabel>
            <StyledTextField
              value={form.tags}
              onChange={(e) => set("tags", e.target.value)}
              fullWidth
              size="small"
              placeholder="react, typescript, nextjs"
              helperText="Comma-separated"
              slotProps={{ formHelperText: { style: { color: theme.palette.custom.accentText, fontSize: "0.7rem" } } }}
            />
          </Box>
          <Box>
            <FieldLabel>Cover Image URL</FieldLabel>
            <StyledTextField
              value={form.coverImage}
              onChange={(e) => set("coverImage", e.target.value)}
              fullWidth
              size="small"
              placeholder="https://…"
            />
          </Box>
        </SidebarCard>

        <SidebarCard>
          <Typography sx={{ fontWeight: 600, fontSize: "0.9rem", color: "text.primary" }}>
            SEO
          </Typography>
          <Box>
            <FieldLabel>Meta Title Override</FieldLabel>
            <StyledTextField
              value={form.seoTitle}
              onChange={(e) => set("seoTitle", e.target.value)}
              fullWidth
              size="small"
            />
          </Box>
          <Box>
            <FieldLabel>Meta Description Override</FieldLabel>
            <StyledTextField
              value={form.seoDescription}
              onChange={(e) => set("seoDescription", e.target.value)}
              fullWidth
              size="small"
              multiline
              rows={3}
            />
          </Box>
        </SidebarCard>
      </Sidebar>
    </PageWrapper>
  );
}
