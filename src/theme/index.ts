import { createTheme, type PaletteMode } from "@mui/material/styles";

// ─── Custom palette extensions ───────────────────────────────────────────────
declare module "@mui/material/styles" {
  interface Palette {
    custom: {
      mainHover: string;
      secondaryHover: string;
      tertiary: string;
      tertiaryText: string;
      tertiaryTextHover: string;
      accentText: string;
      accentTextHover: string;
      borderHover: string;
      main60: string;
    };
  }
  interface PaletteOptions {
    custom?: Partial<Palette["custom"]>;
  }
  interface PaletteColor {
    glow: string;
    border: string;
    alpha10: string;
    alpha20: string;
    scanLineBg: string;
  }
  interface SimplePaletteColorOptions {
    glow?: string;
    border?: string;
    alpha10?: string;
    alpha20?: string;
    scanLineBg?: string;
  }
}

// ─── Theme factory ────────────────────────────────────────────────────────────
export const createAppTheme = (mode: PaletteMode = "light") => {
  const isDark = mode === "dark";

  return createTheme({
    palette: {
      mode,
      primary: {
        main: isDark ? "#38bdf8" : "#0284c7",
        glow: isDark ? "rgba(56, 189, 248, 0.08)" : "rgba(2, 132, 199, 0.08)",
        border: isDark ? "rgba(56, 189, 248, 0.15)" : "rgba(2, 132, 199, 0.2)",
        alpha10: isDark ? "rgba(56, 189, 248, 0.1)" : "rgba(2, 132, 199, 0.1)",
        alpha20: isDark ? "rgba(56, 189, 248, 0.2)" : "rgba(2, 132, 199, 0.2)",
        scanLineBg: isDark
          ? "linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.28), transparent)"
          : "linear-gradient(90deg, transparent, rgba(2, 132, 199, 0.5), transparent)",
      },
      background: {
        default: isDark ? "#121212" : "#F7F7F7",
        paper: isDark ? "#1e1e1e" : "#e1e1e1",
      },
      text: {
        primary: isDark ? "#F7F7F7" : "#121212",
        secondary: isDark ? "#e1e1e1" : "#1e1e1e",
      },
      divider: isDark ? "#2e2e2e" : "#e1e1e1",
      custom: {
        mainHover: isDark ? "#1e1e1e" : "#e1e1e1",
        secondaryHover: isDark ? "#2e2e2e" : "#d1d1d1",
        tertiary: isDark ? "#2e2e2e" : "#d1d1d1",
        tertiaryText: isDark ? "#d1d1d1" : "#2e2e2e",
        tertiaryTextHover: isDark ? "#c1c1c1" : "#3e3e3e",
        accentText: isDark ? "#c1c1c1" : "#3e3e3e",
        accentTextHover: isDark ? "#b1b1b1" : "#4e4e4e",
        borderHover: isDark ? "#818181" : "#717171",
        main60: isDark ? "rgba(0, 0, 0, 0.6)" : "rgba(255, 255, 255, 0.6)",
      },
    },
    typography: {
      fontFamily: '"Outfit", sans-serif',
    },
    breakpoints: {
      values: { xs: 0, sm: 576, md: 768, lg: 992, xl: 1200 },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: `
          *, *::before, *::after {
            transition:
              background-color 300ms, border-color 300ms, opacity 300ms,
              box-shadow 300ms, top 300ms, bottom 300ms, left 300ms,
              margin 300ms, transform 300ms;
            user-select: none;
          }
          html {
            overflow-y: scroll;
          }
          html[data-theme="dark"] {
            background-color: #121212;
            color-scheme: dark;
          }
          html[data-theme="dark"] body {
            background-color: #121212;
            color: #F7F7F7;
          }
          html[data-theme="light"] {
            background-color: #F7F7F7;
            color-scheme: light;
          }
          html[data-theme="light"] body {
            background-color: #F7F7F7;
            color: #121212;
          }
          body {
            font-family: 'Outfit', sans-serif;
            -webkit-font-smoothing: antialiased;
            letter-spacing: 1px;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            margin: 0;
          }
          main {
            flex: 1;
            display: flex;
            flex-direction: column;
            position: relative;
            z-index: 1;
          }
          code {
            font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
          }
          a { color: inherit; }
          .code-keyword  { color: #bd2864; }
          .code-string   { color: inherit; }
          .code-function { color: #52a8ff; }
          .code-constant { color: #f8c555; }
          .code-operator { color: #67cdcc; }
        `,
      },
    },
  });
};
