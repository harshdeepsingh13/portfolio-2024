import { styled } from "@mui/material/styles";

export const LoaderWrapper = styled("div")<{ size: number }>(({ theme, size }) => ({
  "--ls": `${size}px`,
  position: "relative",
  zIndex: 2,
  height: `${size * 2.75}px`,
  width: `${size * 2.75}px`,
  display: "grid",
  placeItems: "center",

  "& .cube-wrapper": {
    transformStyle: "preserve-3d",
    animation: "bouncing 2s infinite",
  },
  "& .cube": {
    transformStyle: "preserve-3d",
    transform: "rotateX(45deg) rotateZ(45deg)",
    animation: "rotation 2s infinite",
  },
  "& .cube-faces": {
    transformStyle: "preserve-3d",
    height: "var(--ls)",
    width: "var(--ls)",
    position: "relative",
    transformOrigin: "0 0",
    transform: "translateX(0) translateY(0) translateZ(calc(var(--ls) / -2))",
  },
  "& .cube-face": {
    position: "absolute",
    inset: 0,
    background: theme.palette.custom.accentText,
    border: `solid 1px ${theme.palette.divider}`,
    "&.shadow": {
      transform: "translateZ(calc(-1 * var(--ls)))",
      animation: "bouncing-shadow 2s infinite",
    },
    "&.top": {
      transform: "translateZ(var(--ls))",
    },
    "&.front": {
      transformOrigin: "0 50%",
      transform: "rotateY(-90deg)",
    },
    "&.back": {
      transformOrigin: "0 50%",
      transform: "rotateY(-90deg) translateZ(calc(-1 * var(--ls)))",
    },
    "&.right": {
      transformOrigin: "50% 0",
      transform: "rotateX(-90deg) translateY(calc(-1 * var(--ls)))",
    },
    "&.left": {
      transformOrigin: "50% 0",
      transform: "rotateX(-90deg) translateY(calc(-1 * var(--ls))) translateZ(var(--ls))",
    },
  },

  "@keyframes rotation": {
    "0%": {
      transform: "rotateX(45deg) rotateY(0) rotateZ(45deg)",
      animationTimingFunction: "cubic-bezier(0.17, 0.84, 0.44, 1)",
    },
    "50%": {
      transform: `rotateX(45deg) rotateY(0) rotateZ(${45 + 180}deg)`,
      animationTimingFunction: "cubic-bezier(0.76, 0.05, 0.86, 0.06)",
    },
    "100%": {
      transform: `rotateX(45deg) rotateY(0) rotateZ(${45 + 360}deg)`,
      animationTimingFunction: "cubic-bezier(0.17, 0.84, 0.44, 1)",
    },
  },
  "@keyframes bouncing": {
    "0%": {
      transform: "translateY(calc(var(--ls) * -0.5))",
      animationTimingFunction: "cubic-bezier(0.76, 0.05, 0.86, 0.06)",
    },
    "45%": {
      transform: "translateY(calc(var(--ls) * 0.5))",
      animationTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
    },
    "100%": {
      transform: "translateY(calc(var(--ls) * -0.5))",
      animationTimingFunction: "cubic-bezier(0.76, 0.05, 0.86, 0.06)",
    },
  },
  "@keyframes bouncing-shadow": {
    "0%": {
      transform: "translateZ(calc(-1 * var(--ls))) scale(1.3)",
      animationTimingFunction: "cubic-bezier(0.76, 0.05, 0.86, 0.06)",
      opacity: 0.05,
    },
    "45%": {
      transform: "translateZ(0)",
      animationTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
      opacity: 0.3,
    },
    "100%": {
      transform: "translateZ(calc(-1 * var(--ls))) scale(1.3)",
      animationTimingFunction: "cubic-bezier(0.76, 0.05, 0.86, 0.06)",
      opacity: 0.05,
    },
  },
}));
