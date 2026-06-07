"use client";

import { fadeIn } from "@/theme/animations";
import { styled } from "@mui/material/styles";

export const BlogCardWrapper = styled("article", {
  shouldForwardProp: (prop) => prop !== "delay",
})<{ delay?: number }>(({ theme, delay = 0 }) => ({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  background: theme.palette.primary.glow,
  border: `1px solid ${theme.palette.primary.border}`,
  borderRadius: "16px",
  overflow: "hidden",
  textDecoration: "none",
  color: "inherit",
  cursor: "pointer",
  animation: `${fadeIn} 0.5s ease both`,
  animationDelay: `${delay}s`,
  transition: "transform 300ms ease, border-color 300ms, box-shadow 300ms",

  "&:hover": {
    transform: "translateY(-4px)",
    borderColor: theme.palette.primary.alpha20,
    boxShadow: `0 8px 32px ${theme.palette.primary.alpha10}, 0 4px 16px ${theme.palette.custom.main60}`,
  },
}));

export const BlogCardImage = styled("div")({
  width: "100%",
  aspectRatio: "16/9",
  overflow: "hidden",
  flexShrink: 0,

  "& img": {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
});

export const BlogCardContent = styled("div")({
  display: "flex",
  flexDirection: "column",
  flex: 1,
  padding: "1.25rem",
  gap: "0.75rem",
});

export const BlogCardTitle = styled("h2")(({ theme }) => ({
  margin: 0,
  fontSize: "1.05rem",
  fontWeight: 700,
  fontFamily: "'Outfit', sans-serif",
  color: theme.palette.text.primary,
  lineHeight: 1.4,
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
}));

export const BlogCardExcerpt = styled("p")(({ theme }) => ({
  margin: 0,
  fontSize: "0.875rem",
  color: theme.palette.custom.tertiaryText,
  fontWeight: 300,
  lineHeight: 1.7,
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  flex: 1,
}));

export const BlogCardTagsRow = styled("div")({
  display: "flex",
  flexWrap: "wrap",
  gap: "0.4rem",
});

export const BlogCardTag = styled("span")(({ theme }) => ({
  fontSize: "0.75rem",
  padding: "2px 8px",
  borderRadius: "50px",
  border: `1px solid ${theme.palette.primary.border}`,
  color: theme.palette.primary.main,
  backgroundColor: theme.palette.primary.glow,
}));

export const BlogCardMeta = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  fontSize: "0.78rem",
  color: theme.palette.custom.accentText,
  borderTop: `1px solid ${theme.palette.divider}`,
  paddingTop: "0.75rem",
  flexWrap: "wrap",
}));

export const BlogCardMetaDot = styled("span")(({ theme }) => ({
  color: theme.palette.divider,
}));
