"use client";

import BlogEditor from "@/components/BlogEditor";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { styled, useTheme } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import slugify from "slugify";

// ── Styled components ─────────────────────────────────────────────────────────

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

// ── Helpers ───────────────────────────────────────────────────────────────────

function generateSlug(title: string): string {
  return slugify(title, { lower: true, strict: true, trim: true });
}

// ── Page ──────────────────────────────────────────────────────────────────────

interface PostFormState {
  title: string;
  slug: string;
  excerpt: string;
  tags: string;           // comma-separated raw input
  status: "draft" | "published";
  coverImage: string;
  seoTitle: string;
  seoDescription: string;
  body_json: Record<string, unknown> | null;
  body_html: string;
}

const DEFAULT_FORM: PostFormState = {
  title: "",
  slug: "",
  excerpt: "",
  tags: "",
  status: "draft",
  coverImage: "",
  seoTitle: "",
  seoDescription: "",
  body_json: null,
  body_html: "",
};

export default function NewPostPage() {
  const router = useRouter();
  const theme = useTheme();

  const [form, setForm] = useState<PostFormState>(DEFAULT_FORM);
  const [slugEdited, setSlugEdited] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update a field in the form
  const set = useCallback(<K extends keyof PostFormState>(key: K, value: PostFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  // Auto-generate slug from title (unless the user has manually edited it)
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    set("title", title);
    if (!slugEdited) {
      set("slug", generateSlug(title));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlugEdited(true);
    set("slug", e.target.value);
  };

  const handleEditorChange = useCallback(
    ({ json, html }: { json: Record<string, unknown>; html: string }) => {
      setForm((prev) => ({ ...prev, body_json: json, body_html: html }));
    },
    []
  );

  const handleSave = async () => {
    setError(null);
    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!form.slug.trim()) {
      setError("Slug is required.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        excerpt: form.excerpt.trim() || undefined,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        status: form.status,
        coverImage: form.coverImage.trim() || undefined,
        body_json: form.body_json,
        body_html: form.body_html,
        seo: {
          metaTitle: form.seoTitle.trim() || undefined,
          metaDescription: form.seoDescription.trim() || undefined,
        },
        // Reading time: rough estimate (~200 wpm)
        readingTime: form.body_html
          ? Math.max(1, Math.round(form.body_html.replace(/<[^>]+>/g, "").split(/\s+/).length / 200))
          : undefined,
      };

      const res = await fetch("/api/blog/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }

      router.push("/admin/posts");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save post.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageWrapper>
      {/* ── Left: Editor ───────────────────────────────── */}
      <EditorPanel>
        <Box>
          <Typography
            component="h1"
            sx={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "text.primary",
              marginBottom: "4px",
            }}
          >
            New Post
          </Typography>
          <Typography sx={{ fontSize: "0.8rem", color: "custom.accentText" }}>
            Write and publish a new blog post.
          </Typography>
        </Box>

        {/* Title field */}
        <StyledTextField
          label="Post Title"
          value={form.title}
          onChange={handleTitleChange}
          fullWidth
          required
          placeholder="My Awesome Post"
          slotProps={{ input: { style: { fontSize: "1.1rem", fontWeight: 600 } } }}
        />

        {/* TipTap Editor */}
        <BlogEditor onChange={handleEditorChange} placeholder="Write your post content here…" />

        {error && (
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
            {error}
          </Typography>
        )}
      </EditorPanel>

      {/* ── Right: Metadata sidebar ─────────────────────── */}
      <Sidebar>
        {/* Publish controls */}
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
            {saving ? "Saving…" : form.status === "published" ? "Publish Post" : "Save Draft"}
          </Button>
        </SidebarCard>

        {/* Slug */}
        <SidebarCard>
          <Typography sx={{ fontWeight: 600, fontSize: "0.9rem", color: "text.primary" }}>
            URL
          </Typography>
          <Box>
            <FieldLabel>Slug</FieldLabel>
            <StyledTextField
              value={form.slug}
              onChange={handleSlugChange}
              fullWidth
              size="small"
              placeholder="my-awesome-post"
              helperText="Auto-generated from title. Edit to customise."
              slotProps={{ formHelperText: { style: { color: theme.palette.custom.accentText, fontSize: "0.7rem" } } }}
            />
          </Box>
        </SidebarCard>

        {/* Post details */}
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
              placeholder="Brief summary shown in post listings…"
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

        {/* SEO */}
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
              placeholder="Defaults to post title"
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
              placeholder="Defaults to excerpt"
            />
          </Box>
        </SidebarCard>
      </Sidebar>
    </PageWrapper>
  );
}
