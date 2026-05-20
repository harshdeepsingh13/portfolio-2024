"use client";

import { Row } from "@/app/_globalStyles";
import { fadeIn } from "@/theme/animations";
import { styled } from "@mui/material/styles";
import Card from "../Card";

export const SkillsRow = styled(Row)({
  marginTop: "2.5rem",
});

export const SkillItem = styled(Card, {
  shouldForwardProp: (prop) => prop !== "delay",
})<{ delay?: number }>(({ delay = 0 }) => ({
  animation: `${fadeIn} 0.5s ease both`,
  animationDelay: `${delay}s`,
}));
