"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "next/link";

interface PreviewBannerProps {
  postId: string;
  slug: string;
}

export default function PreviewBanner({ postId, slug: _slug }: PreviewBannerProps) {
  return (
    <Box
      sx={{
        position: "sticky",
        top: "3rem",
        zIndex: 200,
        backgroundColor: "warning.main",
        color: "#000",
        py: "10px",
        px: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "8px",
      }}
    >
      <Typography sx={{ fontSize: "0.875rem", fontWeight: 600 }}>
        ⚠ Preview — This post is not publicly visible
      </Typography>
      <Box
        component={Link}
        href={`/admin/posts/${postId}/edit`}
        sx={{
          fontSize: "0.8rem",
          fontWeight: 600,
          color: "#000",
          textDecoration: "underline",
          whiteSpace: "nowrap",
        }}
      >
        Edit post
      </Box>
    </Box>
  );
}
