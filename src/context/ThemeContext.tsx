"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type ThemeContextType = {
  theme: string;
  setTheme: ((theme: string) => string | void) & ((updater: (prev: string) => string) => string | void);
};

export const ThemeContext = createContext({});

export const useThemeContext = () => useContext(ThemeContext) as ThemeContextType;

export const THEME = { LIGHT: "light", DARK: "dark" };

const ThemeContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState(() => {
    if (typeof document !== "undefined") {
      return document.documentElement.getAttribute("data-theme") ?? THEME.LIGHT;
    }
    return THEME.LIGHT;
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("theme", theme);
    } catch {}
  }, [theme]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? THEME.DARK : THEME.LIGHT);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
    }),
    [theme]
  );

  return (
    <>
      <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    </>
  );
};

export default ThemeContextProvider;
