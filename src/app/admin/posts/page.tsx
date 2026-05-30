"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { styled, useTheme } from "@mui/material/styles";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { BlogPostPreview } from "@/types/blog";

// ── Styled components ─────────────────────────────────────────────────────────

const Table = styled("table")(({ theme }) => ({
  width: "100%",
  borderCollapse: "collapse",
  fontSize: "0.875rem",

  "& th": {
    textAlign: "left",
    padding: "10px 14px",
    borderBottom: `2px solid ${theme.palette.divider}`,
    color: theme.palette.custom.accentText,
    fontWeight: 600,
    textTransform: "uppercase",
    fontSize: "0.75rem",
    letterSpacing: "0.6px",
    whiteSpace: "nowrap",
  },

  "& td": {
    padding: "12px 14px",
    borderBottom: `1px solid ${theme.palette.divider}`,
    color: theme.palette.text.primary,
    verticalAlign: "middle",
  },

  "& tr:last-child td": {
    borderBottom: "none",
  },

  "& tr:hover td": {
    backgroundColor: theme.palette.custom.mainHover,
  },
}));

const StatusBadge = styled("span")<{ status: "draft" | "published" }>(({ theme, status }) => ({
  display: "inline-block",
  padding: "2px 10px",
  borderRadius: "50px",
  fontSize: "0.72rem",
  fontWeight: 600,
  letterSpacing: "0.4px",
  textTransform: "uppercase",
  backgroundColor: status === "published" ? "rgba(34,197,94,0.12)" : "rgba(234,179,8,0.12)",
  color: status === "published" ? "#22c55e" : "#eab308",
  border: status === "published" ? "1px solid rgba(34,197,94,0.3)" : "1px solid rgba(234,179,8,0.3)",
}));

const ActionBtn = styled("button")<{ variant?: "edit" | "delete" }>(({ theme, variant }) => ({
  padding: "5px 12px",
  borderRadius: "6px",
  border: `1px solid ${variant === "delete" ? "rgba(239,68,68,0.3)" : theme.palette.divider}`,
  backgroundColor: "transparent",
  color: variant === "delete" ? "#ef4444" : theme.palette.custom.tertiaryText,
  cursor: "pointer",
  fontSize: "0.8rem",
  fontFamily: "inherit",
  transition: "background-color 150ms, border-color 150ms",

  "&:hover": {
    backgroundColor:
      variant === "delete" ? "rgba(239,68,68,0.08)" : theme.palette.custom.secondaryHover,
    borderColor: variant === "delete" ? "rgba(239,68,68,0.5)" : theme.palette.custom.borderHover,
  },
}));

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AdminPostsPage() {
  const theme = useTheme();
  const [posts, setPosts] = useState<BlogPostPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/blog/posts?all=true");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch {
      // API not yet available (Unit 4); show empty state
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/blog/posts/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch {
      alert("Failed to delete post. Please try again.");
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-CA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Box sx={{ padding: { xs: "24px 16px", md: "40px 32px" }, maxWidth: "1100px" }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <Box>
          <Typography component="h1" sx={{ fontSize: "1.75rem", fontWeight: 700, color: "text.primary", marginBottom: "4px" }}>
            Posts
          </Typography>
          <Typography sx={{ fontSize: "0.875rem", color: "custom.accentText" }}>
            {posts.length} {posts.length === 1 ? "post" : "posts"} total
          </Typography>
        </Box>
        <Box
          component={Link}
          href="/admin/posts/new"
          sx={{
            display: "inline-block",
            padding: "10px 20px",
            borderRadius: "8px",
            backgroundColor: "primary.main",
            color: "background.default",
            fontSize: "0.875rem",
            fontWeight: 600,
            textDecoration: "none",
            "&:hover": { opacity: 0.85 },
          }}
        >
          + New Post
        </Box>
      </Box>

      {/* Content */}
      <Box
        sx={{
          backgroundColor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        {loading ? (
          <Box sx={{ padding: "40px", textAlign: "center", color: "custom.accentText" }}>
            Loading posts…
          </Box>
        ) : posts.length === 0 ? (
          <Box sx={{ padding: "60px 40px", textAlign: "center" }}>
            <Typography sx={{ color: "custom.accentText", marginBottom: "16px" }}>
              No posts yet.
            </Typography>
            <Box
              component={Link}
              href="/admin/posts/new"
              sx={{
                display: "inline-block",
                padding: "8px 18px",
                borderRadius: "8px",
                border: "1px solid",
                borderColor: "primary.border",
                color: "primary.main",
                fontSize: "0.875rem",
                textDecoration: "none",
              }}
            >
              Create your first post
            </Box>
          </Box>
        ) : (
          <Box sx={{ overflowX: "auto" }}>
            <Table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Published Date</th>
                  <th>Updated</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post._id}>
                    <td>
                      <Box
                        component={Link}
                        href={`/admin/posts/${post._id}/edit`}
                        sx={{
                          color: theme.palette.text.primary,
                          textDecoration: "none",
                          fontWeight: 500,
                          "&:hover": { color: theme.palette.primary.main },
                        }}
                      >
                        {post.title}
                      </Box>
                      {post.excerpt && (
                        <Typography
                          sx={{
                            fontSize: "0.75rem",
                            color: "custom.accentText",
                            marginTop: "2px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            maxWidth: "360px",
                          }}
                        >
                          {post.excerpt}
                        </Typography>
                      )}
                    </td>
                    <td>
                      <StatusBadge status={post.status}>{post.status}</StatusBadge>
                    </td>
                    <td style={{ color: theme.palette.custom.accentText }}>
                      {formatDate(post.publishedAt)}
                    </td>
                    <td style={{ color: theme.palette.custom.accentText }}>
                      {formatDate(post.updatedAt)}
                    </td>
                    <td>
                      <Box sx={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                        <ActionBtn
                          variant="edit"
                          onClick={() =>
                            (window.location.href = `/admin/posts/${post._id}/edit`)
                          }
                        >
                          Edit
                        </ActionBtn>
                        <ActionBtn
                          variant="delete"
                          disabled={deleting === post._id}
                          onClick={() => handleDelete(post._id, post.title)}
                        >
                          {deleting === post._id ? "…" : "Delete"}
                        </ActionBtn>
                      </Box>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Box>
        )}
      </Box>
    </Box>
  );
}
