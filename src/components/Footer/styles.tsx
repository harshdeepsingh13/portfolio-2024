"use client";

import { keyframes } from "@emotion/react";
import { styled } from "@mui/material/styles";

// Local heartbeat — 42% uses scale(1.2), distinct from the theme heartbeat (1.3).
const heartbeat = keyframes`
  0%,100% { transform: scale(1); }
  14%      { transform: scale(1.3); }
  28%      { transform: scale(1); }
  42%      { transform: scale(1.2); }
  70%      { transform: scale(1); }
`;

export const FooterWrapper = styled("footer")(({ theme }) => ({
  textAlign: "center",
  padding: "1.5rem",
  fontSize: "0.8em",
  fontWeight: 300,
  color: theme.palette.custom.tertiaryText,
  borderTop: `1px solid ${theme.palette.divider}`,
  letterSpacing: "1px",
}));

export const HeartIcon = styled("span")(() => ({
  color: "#e11d48",
  display: "inline-block",
  animation: `${heartbeat} 1.6s ease-in-out infinite`,
}));
