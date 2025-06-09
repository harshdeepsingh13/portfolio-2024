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
  const [theme, setTheme] = useState(THEME.LIGHT);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

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
