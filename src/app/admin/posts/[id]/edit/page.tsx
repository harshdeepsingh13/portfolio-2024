"use client";

import BlogEditor from "@/components/BlogEditor";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { styled, useTheme } from "@mui/material/styles";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import slugify from "slugify";
import type { BlogPost } from "@/types/blog";

// ── Styled components (shared with /new) ─────────────────────────────────────

const PageWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  gap: "24px",
  padding: "32px",
  minHeight: "100vh",
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
  status: "draft" | "published";
  coverImage: string;
  seoTitle: string;
  seoDescription: string;
  body_json: Record<string, unknown> | null;
  body_html: string;
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
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Resolve async params in Next.js 15
  useEffect(() => {
    params.then((p) => setPostId(p.id));
  }, [params]);

  // Fetch post data once we have the ID
  useEffect(() => {
    if (!postId) return;

    const load = async () => {
      try {
        const res = await fetch(`/api/blog/posts/${postId}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const post: BlogPost = await res.json();

        setForm({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt ?? "",
          tags: post.tags.join(", "),
          status: post.status,
          coverImage: post.coverImage ?? "",
          seoTitle: post.seo?.metaTitle ?? "",
          seoDescription: post.seo?.metaDescription ?? "",
          body_json: post.body_json ?? null,
          body_html: post.body_html ?? "",
        });
      } catch {
        setLoadError("Failed to load post. The API may not be available yet.");
      }
    };

    load();
  }, [postId]);

  const set = useCallback(<K extends keyof PostFormState>(key: K, value: PostFormState[K]) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  }, []);

  const handleEditorChange = useCallback(
    ({ json, html }: { json: Record<string, unknown>; html: string }) => {
      setForm((prev) => (prev ? { ...prev, body_json: json, body_html: html } : prev));
    },
    []
  );

  const handleSave = async () => {
    if (!form || !postId) return;
    setSaveError(null);

    if (!form.title.trim()) { setSaveError("Title is required."); return; }
    if (!form.slug.trim()) { setSaveError("Slug is required."); return; }

    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        excerpt: form.excerpt.trim() || undefined,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        status: form.status,
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
      };

      const res = await fetch(`/api/blog/posts/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }

      router.push("/admin/posts");
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save post.");
    } finally {
      setSaving(false);
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
          <Box>
            <FieldLabel>Status</FieldLabel>
            <Select
              value={form.status}
              onChange={(e) => set("status", e.target.value as "draft" | "published")}
              fullWidth
              size="small"
              sx={{
                backgroundColor: theme.palette.background.default,
                color: theme.palette.text.primary,
                fontSize: "0.875rem",
                "& .MuiOutlinedInput-notchedOutline": { borderColor: theme.palette.divider },
              }}
            >
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="published">Published</MenuItem>
            </Select>
          </Box>
          <Button
            onClick={handleSave}
            disabled={saving}
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
            {saving ? "Saving…" : "Update Post"}
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
