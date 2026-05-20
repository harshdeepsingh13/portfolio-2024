"use client";

import { createAppTheme } from "@/theme";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type ThemeContextType = {
  theme: string;
  setTheme: (theme: string) => void;
};

export const ThemeContext = createContext<ThemeContextType | {}>({});
export const useThemeContext = () => useContext(ThemeContext) as ThemeContextType;
export const THEME = { LIGHT: "light", DARK: "dark" };

const ThemeContextProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<string>(() => {
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

  const muiTheme = useMemo(() => createAppTheme(theme as "light" | "dark"), [theme]);
  const value = useMemo(() => ({ theme, setTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline key={theme} />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeContextProvider;
