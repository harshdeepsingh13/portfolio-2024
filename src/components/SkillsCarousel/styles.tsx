"use client";

import { styled } from "@mui/material/styles";

export const SkillsCarouselWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.custom.accentText,
  userSelect: "none",
  "& .skills-container": {
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    width: "150px",
  },
}));

export const SkillItem = styled("div")({
  textAlign: "center",
  padding: "15px",
  width: "150px",
  "& .logo": {
    width: "120px",
    height: "120px",
    aspectRatio: "1/1",
    fill: "red",
    "& svg": { fill: "red" },
  },
  "& .text": {
    marginTop: "20px",
    width: "100%",
  },
});

export const CarouselButton = styled("div")(({ theme }) => ({
  border: `thin solid ${theme.palette.divider}`,
  borderRadius: "50%",
  backgroundColor: "transparent",
  padding: "5px",
  fontWeight: 500,
  margin: "0 10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  "& svg": {
    width: "0.7em",
    height: "0.7em",
  },
  "&:hover": {
    borderColor: theme.palette.custom.borderHover,
  },
}));
