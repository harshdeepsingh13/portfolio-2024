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

export const CategorySection = styled("section")({
  marginBottom: "2.5rem",
});

export const CategoryTitle = styled("h2")(({ theme }) => ({
  fontWeight: 700,
  fontSize: "1.25rem",
  marginBottom: "0.5rem",
  color: theme.palette.text.primary,
}));

export const CategoryDescription = styled("p")(({ theme }) => ({
  color: theme.palette.text.secondary,
  margin: "0 0 1.5rem",
}));
