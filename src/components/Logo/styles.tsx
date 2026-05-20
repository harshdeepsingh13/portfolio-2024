import { keyframes } from "@emotion/react";
import { styled } from "@mui/material/styles";
import { blink } from "@/theme/animations";

const drawStem = keyframes`
  from { stroke-dashoffset: 17; }
  to   { stroke-dashoffset: 0; }
`;

const drawArch = keyframes`
  from { stroke-dashoffset: 50; }
  to   { stroke-dashoffset: 0; }
`;

const popIn = keyframes`
  from { opacity: 0; transform: scale(0.6); }
  to   { opacity: 1; transform: scale(1); }
`;

export const LogoWrapper = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: "8px",
});

export const LogoSvg = styled("svg")({
  flexShrink: 0,
  "& .prompt": {
    opacity: 0,
    animation: `${popIn} 0.25s ease 0.1s forwards`,
  },
  "& .h-stem": {
    strokeDasharray: 17,
    strokeDashoffset: 17,
    animation: `${drawStem} 0.35s ease 0.35s forwards`,
  },
  "& .h-arch": {
    strokeDasharray: 50,
    strokeDashoffset: 50,
    animation: `${drawArch} 0.4s ease 0.7s forwards`,
  },
  "& .svg-cursor": {
    opacity: 0,
    animation: `${popIn} 0.1s ease 1.1s forwards, ${blink} 1s step-end 1.2s infinite`,
  },
});

export const TextCursor = styled("span")(({ theme }) => ({
  display: "inline-block",
  width: "2px",
  height: "0.8em",
  background: theme.palette.primary.main,
  verticalAlign: "middle",
  animation: `${blink} 1s step-end infinite`,
}));
