import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import StatCard from "./StatCard";

// ── Types ─────────────────────────────────────────────────────────────────────

interface PostStats {
  total: number;
  published: number;
  drafts: number;
}

// ── Data fetcher ──────────────────────────────────────────────────────────────

async function getPostStats(): Promise<PostStats> {
  try {
    // Unit 4 will build the API route. Stub with empty state until then.
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/blog/posts?all=true`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("API not ready");
    const posts = await res.json();
    const total: number = posts.length;
    const published: number = posts.filter((p: { status: string }) => p.status === "published").length;
    return { total, published, drafts: total - published };
  } catch {
    // Graceful degradation — API route not yet available
    return { total: 0, published: 0, drafts: 0 };
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const stats = await getPostStats();

  return (
    <Box
      sx={{
        padding: { xs: "24px 16px", md: "40px 32px" },
        maxWidth: "900px",
      }}
    >
      <Typography
        component="h1"
        sx={{
          fontSize: "1.75rem",
          fontWeight: 700,
          color: "text.primary",
          marginBottom: "6px",
        }}
      >
        Dashboard
      </Typography>
      <Typography
        sx={{
          fontSize: "0.875rem",
          color: "custom.accentText",
          marginBottom: "32px",
        }}
      >
        Overview of your blog content.
      </Typography>

      {/* Stats row */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          marginBottom: "40px",
        }}
      >
        <StatCard label="Total Posts" value={stats.total} accent />
        <StatCard label="Published" value={stats.published} />
        <StatCard label="Drafts" value={stats.drafts} />
      </Box>

      {/* Quick actions */}
      <Typography
        component="h2"
        sx={{
          fontSize: "1rem",
          fontWeight: 600,
          color: "text.secondary",
          marginBottom: "12px",
        }}
      >
        Quick Actions
      </Typography>
      <Box sx={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
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
            transition: "opacity 150ms",
            "&:hover": { opacity: 0.85 },
          }}
        >
          + New Post
        </Box>
        <Box
          component={Link}
          href="/admin/posts"
          sx={{
            display: "inline-block",
            padding: "10px 20px",
            borderRadius: "8px",
            border: "1px solid",
            borderColor: "divider",
            backgroundColor: "background.paper",
            color: "text.primary",
            fontSize: "0.875rem",
            fontWeight: 500,
            textDecoration: "none",
            transition: "border-color 150ms",
            "&:hover": { borderColor: "custom.borderHover" },
          }}
        >
          View All Posts
        </Box>
      </Box>
    </Box>
  );
}
