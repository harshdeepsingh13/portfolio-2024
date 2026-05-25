"use client";

import { createAppTheme } from "@/theme";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

type ThemeContextType = {
  theme: string;
  setTheme: Dispatch<SetStateAction<string>>;
};

export const ThemeContext = createContext<ThemeContextType | {}>({});
export const useThemeContext = () => useContext(ThemeContext) as ThemeContextType;
export const THEME = { LIGHT: "light", DARK: "dark" };

const ThemeContextProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<string>(THEME.DARK);

  useEffect(() => {
    const domTheme = document.documentElement.getAttribute("data-theme");
    if (domTheme === THEME.DARK || domTheme === THEME.LIGHT) {
      setTheme(domTheme);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("theme", theme);
    } catch {}
  }, [theme]);

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
