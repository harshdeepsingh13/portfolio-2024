"use client";

import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

export const CardWrapper = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== "background" && prop !== "accentColor" && prop !== "sm" && prop !== "lg",
})<{ background?: string; accentColor?: string; sm?: boolean; lg?: number | boolean }>(
  ({ theme, background, accentColor }) => ({
    padding: "25px",
    border: `1px solid ${theme.palette.primary.border}`,
    borderRadius: "20px",
    color: theme.palette.custom.tertiaryText,
    // marginLeft: "1.5rem",
    // marginRight: "1.5rem",
    width: "calc(100% - 1.5rem * 2) !important",
    background: background
      ? `linear-gradient(90deg, ${theme.palette.primary.glow} 0%, ${theme.palette.background.default} 60%, ${theme.palette.custom.main60} 100%), no-repeat right 40%/40% url(${background})`
      : `linear-gradient(90deg, ${theme.palette.primary.glow} 0%, ${theme.palette.background.default} 60%, ${theme.palette.custom.main60} 100%)`,
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",

    [`@media (min-width: 576px)`]: {
      width: "calc(100% - 1.5rem * 2) !important",
    },

    [`@media (min-width: 768px)`]: {
      width: "calc(50% - 1.5rem * 2) !important",
    },

    [`@media (min-width: 992px)`]: {
      width: "calc(33.3333% - 1.5rem * 2) !important",
    },

    "&:hover": {
      borderColor: theme.palette.primary.alpha20,
      boxShadow: `0 8px 32px ${theme.palette.primary.glow}`,
      transform: "perspective(1000px) rotateX(var(--rot-x)) rotateY(var(--rot-y)) scale(1.01)",
      ...(accentColor && {
        backgroundImage: `radial-gradient(circle at var(--drop-x) var(--drop-y), ${accentColor}, transparent)`,
      }),
    },
  })
);

export const CardLinksContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: "5px",
});

export const CardLink = styled("a")(({ theme }) => ({
  color: theme.palette.custom.tertiaryText,
  padding: "5px",
  border: `thin solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.custom.main60,
  borderRadius: "10px",

  "&:hover": {
    borderColor: theme.palette.custom.borderHover,
  },
}));

export const CardTag = styled("div")(({ theme }) => ({
  color: theme.palette.custom.tertiaryText,
  padding: "5px",
  border: `thin solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.custom.main60,
  borderRadius: "10px",

  "&:hover": {
    borderColor: theme.palette.custom.borderHover,
  },
}));
