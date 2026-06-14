import Image from "@/elements/Image";
import { fadeIn } from "@/theme/animations";
import { styled } from "@mui/material/styles";
import Link from "next/link";
import Card from "../Card";
import { CardTag } from "../Card/styles";
import { Row } from "@/app/_globalStyles";

export const ProjectsRow = styled(Row)({
  marginTop: "1.25rem",
});

export const ProjectItem = styled(Card, {
  shouldForwardProp: (prop) => prop !== "delay",
})<{ delay?: number }>(({ theme, delay = 0 }) => ({
  display: "flex",
  animation: `${fadeIn} 0.5s ease both`,
  animationDelay: `${delay}s`,
  flexDirection: "column",
  justifyContent: "space-between",

  "& .name-container": {
    display: "flex",
    alignItems: "stretch",
    justifyContent: "space-between",
    gap: "1em",
    margin: "10px 0",
    borderBottom: `thin solid ${theme.palette.divider}`,
    padding: "10px 0",
    fontWeight: 400,
  },

  "& .tag-line-container": {
    color: theme.palette.custom.tertiaryText,
    fontStyle: "italic",
    fontWeight: 300,
    margin: "10px 0",
  },

  "& .technology-stack-container": {
    color: theme.palette.custom.tertiaryText,
    fontSize: "0.8em",
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "1em",
    marginTop: "15px",
    borderTop: `thin solid ${theme.palette.divider}`,
    paddingTop: "10px",
    fontWeight: 400,
    justifySelf: "flex-end",
  },

  "& .summary-container": {
    fontSize: "0.9em",
    color: theme.palette.text.secondary,
    fontWeight: 300,
    margin: "1.5em 0 1.8em 0",
  },
}));

export const CaseStudyLink = styled(Link)(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.35em",
  marginTop: "0.25em",
  fontSize: "0.9em",
  fontWeight: 500,
  color: theme.palette.primary.main,
  textDecoration: "none",
  transition: "gap 0.2s ease, opacity 0.2s ease",
  "&:hover": {
    opacity: 0.8,
    gap: "0.6em",
  },
}));

export const ProjectLogo = styled(Image)({
  aspectRatio: "1/1",
  display: "block",
});

export const TechItem = styled(CardTag)({});
