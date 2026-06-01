"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { styled, useTheme } from "@mui/material/styles";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useBlogPosts, useDeletePost } from "@/hooks/blog/useBlogPosts";

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
  backgroundColor:
    status === "published"
      ? `${theme.palette.success.main}1f`
      : `${theme.palette.warning.main}1f`,
  color: status === "published" ? theme.palette.success.main : theme.palette.warning.main,
  border:
    status === "published"
      ? `1px solid ${theme.palette.success.main}4d`
      : `1px solid ${theme.palette.warning.main}4d`,
}));

const ActionBtn = styled("button")<{ variant?: "edit" | "delete" }>(({ theme, variant }) => ({
  padding: "5px 12px",
  borderRadius: "6px",
  border: `1px solid ${variant === "delete" ? `${theme.palette.error.main}4d` : theme.palette.divider}`,
  backgroundColor: "transparent",
  color: variant === "delete" ? theme.palette.error.main : theme.palette.custom.tertiaryText,
  cursor: "pointer",
  fontSize: "0.8rem",
  fontFamily: "inherit",
  transition: "background-color 150ms, border-color 150ms",

  "&:hover": {
    backgroundColor:
      variant === "delete" ? `${theme.palette.error.main}14` : theme.palette.custom.secondaryHover,
    borderColor:
      variant === "delete" ? `${theme.palette.error.main}80` : theme.palette.custom.borderHover,
  },
}));

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AdminPostsPage() {
  const theme = useTheme();
  const router = useRouter();

  const { data: posts = [], isLoading, isError } = useBlogPosts();
  const { mutate: deletePostMutate, isPending: isDeleting, variables: deletingId } = useDeletePost();

  const handleDelete = (id: string, title: string) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    deletePostMutate(id, {
      onError: () => alert("Failed to delete post. Please try again."),
    });
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
        {isLoading ? (
          <Box sx={{ padding: "40px", textAlign: "center", color: "custom.accentText" }}>
            Loading posts…
          </Box>
        ) : isError ? (
          <Box sx={{ padding: "40px", textAlign: "center", color: "error.main" }}>
            Failed to load posts. Please refresh the page.
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
                      <Box sx={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                        <StatusBadge status={post.status}>{post.status}</StatusBadge>
                        {post.hasDraft && post.status === "published" && (
                          <Box
                            component="span"
                            sx={{
                              display: "inline-block",
                              padding: "2px 8px",
                              borderRadius: "50px",
                              fontSize: "0.7rem",
                              fontWeight: 600,
                              letterSpacing: "0.4px",
                              textTransform: "uppercase",
                              backgroundColor: `${theme.palette.warning.main}1f`,
                              color: theme.palette.warning.main,
                              border: `1px solid ${theme.palette.warning.main}4d`,
                            }}
                          >
                            Pending
                          </Box>
                        )}
                      </Box>
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
                          onClick={() => router.push(`/admin/posts/${post._id}/edit`)}
                        >
                          Edit
                        </ActionBtn>
                        <ActionBtn
                          variant="delete"
                          disabled={isDeleting && deletingId === post._id}
                          onClick={() => handleDelete(post._id, post.title)}
                        >
                          {isDeleting && deletingId === post._id ? "…" : "Delete"}
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
