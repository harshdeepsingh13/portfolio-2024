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
import { useCallback, useEffect, useRef, useState } from "react";
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

function buildPayload(form: PostFormState) {
  return {
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
    readingTime: form.body_html
      ? Math.max(1, Math.round(form.body_html.replace(/<[^>]+>/g, "").split(/\s+/).length / 200))
      : undefined,
  };
}

// ── Types ─────────────────────────────────────────────────────────────────────

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

// ── Page ──────────────────────────────────────────────────────────────────────

export default function NewPostPage() {
  const router = useRouter();
  const theme = useTheme();

  const [form, setForm] = useState<PostFormState>(DEFAULT_FORM);
  const [slugEdited, setSlugEdited] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState<string>("");

  // Refs for auto-save (avoid stale closures)
  const formRef = useRef<PostFormState>(DEFAULT_FORM);
  const savedPostId = useRef<string | null>(null);
  const isDirtyRef = useRef(false);

  // Keep formRef in sync with state
  useEffect(() => {
    formRef.current = form;
    isDirtyRef.current = true;
  }, [form]);

  const set = useCallback(<K extends keyof PostFormState>(key: K, value: PostFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

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

  // Auto-save function (reads from ref to avoid stale closure)
  const autoSave = useCallback(async () => {
    const current = formRef.current;
    if (!current.title.trim()) return;

    setAutoSaveStatus("Saving…");
    try {
      const payload = buildPayload(current);
      let ok = false;

      if (!savedPostId.current) {
        const res = await fetch("/api/blog/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const data = await res.json();
          savedPostId.current = data._id;
          ok = true;
        }
      } else {
        const res = await fetch(`/api/blog/posts/${savedPostId.current}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        ok = res.ok;
      }

      if (ok) {
        isDirtyRef.current = false;
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

  // 30-second auto-save interval
  useEffect(() => {
    const interval = setInterval(autoSave, 30_000);
    return () => clearInterval(interval);
  }, [autoSave]);

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

  const handleSave = async () => {
    setError(null);
    if (!form.title.trim()) { setError("Title is required."); return; }
    if (!form.slug.trim()) { setError("Slug is required."); return; }

    setSaving(true);
    try {
      const payload = buildPayload(form);

      let res: Response;
      if (!savedPostId.current) {
        res = await fetch("/api/blog/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`/api/blog/posts/${savedPostId.current}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }

      isDirtyRef.current = false;
      router.push("/admin/posts");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save post.");
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = async () => {
    if (form.title.trim()) await autoSave();
    const slug = formRef.current.slug.trim();
    if (slug) {
      window.open(`/blog/${slug}?preview=1`, "_blank");
    }
  };

  return (
    <PageWrapper>
      {/* ── Left: Editor ───────────────────────────────── */}
      <EditorPanel>
        <Box>
          <Typography
            component="h1"
            sx={{ fontSize: "1.5rem", fontWeight: 700, color: "text.primary", marginBottom: "4px" }}
          >
            New Post
          </Typography>
          <Typography sx={{ fontSize: "0.8rem", color: "custom.accentText" }}>
            Write and publish a new blog post.
          </Typography>
        </Box>

        <StyledTextField
          label="Post Title"
          value={form.title}
          onChange={handleTitleChange}
          fullWidth
          required
          placeholder="My Awesome Post"
          slotProps={{ input: { style: { fontSize: "1.1rem", fontWeight: 600 } } }}
        />

        <BlogEditor onChange={handleEditorChange} placeholder="Write your post content here…" />

        {autoSaveStatus && (
          <Typography
            sx={{ fontSize: "0.75rem", color: "custom.accentText", textAlign: "right" }}
          >
            {autoSaveStatus}
          </Typography>
        )}

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

          <Button
            onClick={handlePreview}
            disabled={!savedPostId.current && !form.slug.trim()}
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
              onChange={handleSlugChange}
              fullWidth
              size="small"
              placeholder="my-awesome-post"
              helperText="Auto-generated from title. Edit to customise."
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
