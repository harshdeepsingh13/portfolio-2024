"use client";

import BlogEditor from "@/components/BlogEditor";
import { useBlogPost } from "@/hooks/blog/useBlogPost";
import { useNavigationGuard } from "@/hooks/useNavigationGuard";
import { createPost, updatePost } from "@/services/blog/posts";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { styled, useTheme } from "@mui/material/styles";
import { useCallback, useEffect, useRef, useState } from "react";
import slugify from "slugify";

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
  top: "6rem",
  maxHeight: "calc(100vh - 120px)",
  overflowY: "auto",
  borderRadius: "10px",
  [theme.breakpoints.down("md")]: {
    width: "100%",
    position: "static",
    maxHeight: "none",
    overflowY: "visible",
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

// ── Types & helpers ───────────────────────────────────────────────────────────

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

const DEFAULT_FORM: PostFormState = {
  title: "",
  slug: "",
  excerpt: "",
  tags: "",
  coverImage: "",
  seoTitle: "",
  seoDescription: "",
  body_json: null,
  body_html: "",
};

function autoSlug(title: string): string {
  return slugify(title, { lower: true, strict: true, trim: true });
}

function buildPayload(form: PostFormState, extra: Record<string, unknown> = {}) {
  return {
    title: form.title.trim(),
    slug: form.slug.trim(),
    excerpt: form.excerpt.trim() || undefined,
    tags: form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
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
    ...extra,
  };
}

// ── Status indicator (edit mode only) ─────────────────────────────────────────

function StatusIndicator({ postStatus, hasDraft }: { postStatus: "draft" | "published"; hasDraft: boolean }) {
  const theme = useTheme();

  if (postStatus === "draft") {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: theme.palette.custom.accentText,
            flexShrink: 0,
          }}
        />
        <Typography sx={{ fontSize: "0.8rem", color: theme.palette.custom.accentText }}>Draft</Typography>
      </Box>
    );
  }

  if (hasDraft) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Box sx={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "warning.main", flexShrink: 0 }} />
        <Typography sx={{ fontSize: "0.8rem", color: "warning.main" }}>Published · Unpublished changes</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <Box sx={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "success.main", flexShrink: 0 }} />
      <Typography sx={{ fontSize: "0.8rem", color: "success.main" }}>Published · Up to date</Typography>
    </Box>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

interface PostEditorFormProps {
  /** undefined = new-post mode; defined = edit mode */
  postId?: string;
}

export default function PostEditorForm({ postId }: PostEditorFormProps) {
  const isEditMode = Boolean(postId);
  const theme = useTheme();

  // Form state — null in edit mode until the post loads
  const [form, setForm] = useState<PostFormState | null>(isEditMode ? null : DEFAULT_FORM);
  const [slugEdited, setSlugEdited] = useState(false); // new mode: lock slug auto-gen after manual edit

  // Edit-mode-only state
  const [postStatus, setPostStatus] = useState<"draft" | "published">("draft");
  const [hasDraft, setHasDraft] = useState(false);

  const { data: loadedPost, isError: loadError } = useBlogPost(isEditMode ? postId : undefined);

  // Action state
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [discarding, setDiscarding] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState<string>("");

  // Refs — stable across re-renders so auto-save and event handlers avoid stale closures
  const formRef = useRef<PostFormState | null>(isEditMode ? null : DEFAULT_FORM);
  const savedPostIdRef = useRef<string | null>(postId ?? null);
  const postStatusRef = useRef<"draft" | "published">("draft");
  const isDirtyRef = useRef(false);
  // false during TipTap init (edit mode) so appendTransaction-triggered onUpdate doesn't mark dirty
  const isSettledRef = useRef(!isEditMode);

  // Navigation guard: covers beforeunload, popstate (Back button), and sidebar links
  const { guardedNavigate } = useNavigationGuard(isDirtyRef);

  // ── Edit mode: derive form from loaded post ───────────────────────────────

  useEffect(() => {
    if (!loadedPost || !isEditMode) return;
    isSettledRef.current = false;
    const src = loadedPost.hasDraft && loadedPost.draft ? { ...loadedPost, ...loadedPost.draft } : loadedPost;
    const loaded: PostFormState = {
      title: src.title ?? "",
      slug: loadedPost.slug,
      excerpt: src.excerpt ?? "",
      tags: (src.tags ?? loadedPost.tags).join(", "),
      coverImage: src.coverImage ?? "",
      seoTitle: src.seo?.metaTitle ?? "",
      seoDescription: src.seo?.metaDescription ?? "",
      body_json: src.body_json ?? null,
      body_html: src.body_html ?? "",
    };
    setPostStatus(loadedPost.status);
    setHasDraft(loadedPost.hasDraft ?? false);
    postStatusRef.current = loadedPost.status;
    setForm(loaded);
    formRef.current = loaded;
    isDirtyRef.current = false;
    const settleTimer = setTimeout(() => {
      isSettledRef.current = true;
      isDirtyRef.current = false;
    }, 200);
    return () => clearTimeout(settleTimer);
  }, [loadedPost, isEditMode]);

  // Keep formRef in sync — does NOT touch isDirtyRef (dirty is set only by user actions)
  useEffect(() => {
    if (!form) return;
    formRef.current = form;
  }, [form]);

  // ── Field change handlers ─────────────────────────────────────────────────

  const set = useCallback(<K extends keyof PostFormState>(key: K, value: PostFormState[K]) => {
    isDirtyRef.current = true;
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  }, []);

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const title = e.target.value;
      isDirtyRef.current = true;
      setForm((prev) => {
        if (!prev) return prev;
        const next = { ...prev, title };
        if (!isEditMode && !slugEdited) {
          next.slug = autoSlug(title);
        }
        return next;
      });
    },
    [isEditMode, slugEdited],
  );

  const handleSlugChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSlugEdited(true);
      set("slug", e.target.value);
    },
    [set],
  );

  const handleEditorChange = useCallback(({ json, html }: { json: Record<string, unknown>; html: string }) => {
    if (isSettledRef.current) {
      isDirtyRef.current = true;
    }
    setForm((prev) => (prev ? { ...prev, body_json: json, body_html: html } : prev));
  }, []);

  // ── Auto-save (every 30 s, always as draft) ───────────────────────────────
  // Calls service functions directly (not via mutation hooks) because mutation
  // hook state cannot be read reliably inside a setInterval closure.

  const autoSave = useCallback(async () => {
    const current = formRef.current;
    if (!current || !current.title.trim()) return;
    if (!isDirtyRef.current) return;

    setAutoSaveStatus("Saving…");
    try {
      if (!savedPostIdRef.current) {
        const data = await createPost(buildPayload(current, { status: "draft" }));
        savedPostIdRef.current = data._id;
      } else {
        await updatePost(savedPostIdRef.current, buildPayload(current, { mode: "save" }));
        if (postStatusRef.current === "published") {
          setHasDraft(true);
        }
      }

      isDirtyRef.current = false;
      const now = new Date();
      setAutoSaveStatus(`Last saved at ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`);
    } catch {
      setAutoSaveStatus("Auto-save failed");
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(autoSave, 30_000);
    return () => clearInterval(interval);
  }, [autoSave]);

  // ── Manual save (stays on page) ───────────────────────────────────────────

  const handleSave = async () => {
    if (!form) return;
    setSaveError(null);
    if (!form.title.trim()) {
      setSaveError("Title is required.");
      return;
    }
    if (!form.slug.trim()) {
      setSaveError("Slug is required.");
      return;
    }

    setSaving(true);
    try {
      if (!savedPostIdRef.current) {
        const data = await createPost(buildPayload(form, { status: "draft" }));
        savedPostIdRef.current = data._id;
      } else {
        await updatePost(savedPostIdRef.current, buildPayload(form, { mode: "save" }));
        if (postStatus === "published") setHasDraft(true);
      }

      isDirtyRef.current = false;
      const now = new Date();
      setAutoSaveStatus(`Last saved at ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save post.");
    } finally {
      setSaving(false);
    }
  };

  // ── Publish (navigates to posts list) ────────────────────────────────────

  const handlePublish = async () => {
    if (!form) return;
    setSaveError(null);
    if (!form.title.trim()) {
      setSaveError("Title is required.");
      return;
    }
    if (!form.slug.trim()) {
      setSaveError("Slug is required.");
      return;
    }

    setPublishing(true);
    try {
      if (!savedPostIdRef.current) {
        await createPost(buildPayload(form, { status: "published" }));
      } else {
        await updatePost(savedPostIdRef.current, buildPayload(form, { mode: "publish" }));
      }

      isDirtyRef.current = false;
      guardedNavigate("/admin/posts");
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to publish post.");
    } finally {
      setPublishing(false);
    }
  };

  // ── Discard unpublished draft (edit mode only) ────────────────────────────

  const handleDiscard = async () => {
    if (!postId) return;
    if (!window.confirm("Discard all unpublished changes? This cannot be undone.")) return;
    setDiscarding(true);
    setSaveError(null);
    try {
      const updated = await updatePost(postId, { mode: "discard" });
      const loaded: PostFormState = {
        title: updated.title ?? "",
        slug: updated.slug,
        excerpt: updated.excerpt ?? "",
        tags: (updated.tags ?? []).join(", "),
        coverImage: updated.coverImage ?? "",
        seoTitle: updated.seo?.metaTitle ?? "",
        seoDescription: updated.seo?.metaDescription ?? "",
        body_json: updated.body_json ?? null,
        body_html: updated.body_html ?? "",
      };
      setForm(loaded);
      formRef.current = loaded;
      setHasDraft(false);
      isDirtyRef.current = false;
      setAutoSaveStatus("");
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to discard changes.");
    } finally {
      setDiscarding(false);
    }
  };

  // ── Preview ───────────────────────────────────────────────────────────────

  const handlePreview = async () => {
    if (formRef.current?.title.trim()) await autoSave();
    const slug = formRef.current?.slug.trim();
    if (slug) window.open(`/blog/${slug}?preview=1`, "_blank");
  };

  // ── Loading / error (edit mode only) ─────────────────────────────────────

  if (isEditMode && !form) {
    return (
      <Box sx={{ padding: "40px 32px" }}>
        {loadError ? (
          <Box>
            <Typography sx={{ color: "error.main", marginBottom: "16px" }}>
              Failed to load post. The API may not be available yet.
            </Typography>
            <Box
              component="button"
              onClick={() => guardedNavigate("/admin/posts")}
              sx={{
                color: "primary.main",
                fontSize: "0.875rem",
                textDecoration: "underline",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                fontFamily: "inherit",
              }}
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

  if (!form) return null;

  // ── Editor ────────────────────────────────────────────────────────────────

  return (
    <PageWrapper>
      {/* ── Left: editor panel ───────────────────────── */}
      <EditorPanel>
        <Box>
          <Box
            component="button"
            onClick={() => guardedNavigate("/admin/posts")}
            sx={{
              fontSize: "0.8rem",
              color: "primary.main",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              display: "inline-block",
              marginBottom: "8px",
              fontFamily: "inherit",
            }}
          >
            ← Back to posts
          </Box>
          <Typography
            component="h1"
            sx={{ fontSize: "1.5rem", fontWeight: 700, color: "text.primary", marginBottom: "4px" }}
          >
            {isEditMode ? "Edit Post" : "New Post"}
          </Typography>
          {!isEditMode && (
            <Typography sx={{ fontSize: "0.8rem", color: "custom.accentText" }}>
              Write and publish a new blog post.
            </Typography>
          )}
        </Box>

        <StyledTextField
          label="Post Title"
          value={form.title}
          onChange={handleTitleChange}
          fullWidth
          required
          placeholder={isEditMode ? undefined : "My Awesome Post"}
          slotProps={{ input: { style: { fontSize: "1.1rem", fontWeight: 600 } } }}
        />

        <BlogEditor
          content={form.body_json ?? undefined}
          contentHtml={form.body_json ? undefined : form.body_html}
          onChange={handleEditorChange}
          placeholder="Write your post content here…"
        />

        {autoSaveStatus && (
          <Typography sx={{ fontSize: "0.75rem", color: "custom.accentText", textAlign: "right" }}>
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

      {/* ── Right: metadata sidebar ──────────────────── */}
      <Sidebar>
        <SidebarCard>
          <Typography sx={{ fontWeight: 600, fontSize: "0.9rem", color: "text.primary" }}>Publish</Typography>

          {isEditMode && <StatusIndicator postStatus={postStatus} hasDraft={hasDraft} />}

          <Button
            onClick={handleSave}
            disabled={saving || publishing || discarding}
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
            {saving ? "Saving…" : isEditMode ? "Save" : "Save Draft"}
          </Button>

          {isEditMode && hasDraft && (
            <Button
              onClick={handleDiscard}
              disabled={discarding || saving || publishing}
              fullWidth
              variant="outlined"
              sx={{
                borderColor: "error.main",
                color: "error.main",
                fontWeight: 500,
                textTransform: "none",
                borderRadius: "8px",
                fontSize: "0.85rem",
                "&:hover": {
                  borderColor: "error.dark",
                  backgroundColor: "rgba(244,67,54,0.06)",
                },
              }}
            >
              {discarding ? "Discarding…" : "Discard Changes"}
            </Button>
          )}

          <Button
            onClick={handlePublish}
            disabled={publishing || saving || discarding}
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
            disabled={!isEditMode && !savedPostIdRef.current && !form.slug.trim()}
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
          <Typography sx={{ fontWeight: 600, fontSize: "0.9rem", color: "text.primary" }}>URL</Typography>
          <Box>
            <FieldLabel>Slug</FieldLabel>
            <StyledTextField
              value={form.slug}
              onChange={handleSlugChange}
              fullWidth
              size="small"
              placeholder={isEditMode ? undefined : "my-awesome-post"}
              helperText={
                isEditMode
                  ? "Changing the slug will break existing links."
                  : "Auto-generated from title. Edit to customise."
              }
              slotProps={{
                formHelperText: { style: { color: theme.palette.custom.accentText, fontSize: "0.7rem" } },
              }}
            />
          </Box>
        </SidebarCard>

        <SidebarCard>
          <Typography sx={{ fontWeight: 600, fontSize: "0.9rem", color: "text.primary" }}>Details</Typography>
          <Box>
            <FieldLabel>Excerpt</FieldLabel>
            <StyledTextField
              value={form.excerpt}
              onChange={(e) => set("excerpt", e.target.value)}
              fullWidth
              size="small"
              multiline
              rows={3}
              placeholder={isEditMode ? undefined : "Brief summary shown in post listings…"}
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
              slotProps={{
                formHelperText: { style: { color: theme.palette.custom.accentText, fontSize: "0.7rem" } },
              }}
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
          <Typography sx={{ fontWeight: 600, fontSize: "0.9rem", color: "text.primary" }}>SEO</Typography>
          <Box>
            <FieldLabel>Meta Title Override</FieldLabel>
            <StyledTextField
              value={form.seoTitle}
              onChange={(e) => set("seoTitle", e.target.value)}
              fullWidth
              size="small"
              placeholder={isEditMode ? undefined : "Defaults to post title"}
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
              placeholder={isEditMode ? undefined : "Defaults to excerpt"}
            />
          </Box>
        </SidebarCard>
      </Sidebar>
    </PageWrapper>
  );
}
