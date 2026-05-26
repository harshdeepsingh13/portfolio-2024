"use client";

import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { LogoSvg, LogoWrapper, TextCursor } from "./styles";

const Logo = ({ name }: { name: string }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    setDisplayed("");
    const n = name ?? "";
    let i = 0;
    let intervalId: ReturnType<typeof setInterval> | undefined;
    const timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        setDisplayed(n.slice(0, ++i));
        if (i >= n.length) clearInterval(intervalId);
      }, 75);
    }, isMobile ? 300 : 1300);
    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [name, isMobile]);

  return (
    <LogoWrapper>
      <LogoSvg width="28" height="28" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <path
          className="prompt"
          d="M 4 9 L 10 16 L 4 23"
          stroke={theme.palette.text.secondary}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          className="h-stem"
          x1="16" y1="7" x2="16" y2="24"
          stroke={theme.palette.primary.main}
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          className="h-arch"
          d="M 16 15 C 16 10 24 10 24 15 L 24 24"
          stroke={theme.palette.primary.main}
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect
          className="svg-cursor"
          x="26" y="22" width="4" height="2.5" rx="0.5"
          fill={theme.palette.primary.main}
        />
      </LogoSvg>
      <span className="text">{displayed}</span>
      <TextCursor />
    </LogoWrapper>
  );
};

export default Logo;
