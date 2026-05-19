import { createTheme } from "@mui/material/styles";

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

// ─── Design tokens by mode ───────────────────────────────────────────────────
const lightTokens = {
  primary: {
    main: "#0284c7",
    glow: "rgba(2, 132, 199, 0.08)",
    border: "rgba(2, 132, 199, 0.2)",
    alpha10: "rgba(2, 132, 199, 0.1)",
    alpha20: "rgba(2, 132, 199, 0.2)",
    scanLineBg: "linear-gradient(90deg, transparent, rgba(2, 132, 199, 0.5), transparent)",
  },
  background: { default: "#F7F7F7", paper: "#e1e1e1" },
  text: { primary: "#121212", secondary: "#1e1e1e" },
  divider: "#e1e1e1",
  custom: {
    mainHover: "#e1e1e1",
    secondaryHover: "#d1d1d1",
    tertiary: "#d1d1d1",
    tertiaryText: "#2e2e2e",
    tertiaryTextHover: "#3e3e3e",
    accentText: "#3e3e3e",
    accentTextHover: "#4e4e4e",
    borderHover: "#717171",
    main60: "rgba(255, 255, 255, 0.6)",
  },
};

const darkTokens = {
  primary: {
    main: "#38bdf8",
    glow: "rgba(56, 189, 248, 0.08)",
    border: "rgba(56, 189, 248, 0.15)",
    alpha10: "rgba(56, 189, 248, 0.1)",
    alpha20: "rgba(56, 189, 248, 0.2)",
    scanLineBg: "linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.28), transparent)",
  },
  background: { default: "#121212", paper: "#1e1e1e" },
  text: { primary: "#F7F7F7", secondary: "#e1e1e1" },
  divider: "#2e2e2e",
  custom: {
    mainHover: "#1e1e1e",
    secondaryHover: "#2e2e2e",
    tertiary: "#2e2e2e",
    tertiaryText: "#d1d1d1",
    tertiaryTextHover: "#c1c1c1",
    accentText: "#c1c1c1",
    accentTextHover: "#b1b1b1",
    borderHover: "#818181",
    main60: "rgba(0, 0, 0, 0.6)",
  },
};

// ─── Theme factory ────────────────────────────────────────────────────────────
export const createAppTheme = () => {
  return createTheme({
    colorSchemes: {
      light: { palette: lightTokens },
      dark: { palette: darkTokens },
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
          html[data-theme="light"] {
            background-color: #F7F7F7;
            color-scheme: light;
          }
          body {
            font-family: 'Outfit', sans-serif;
            -webkit-font-smoothing: antialiased;
            letter-spacing: 1px;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            background-color: inherit;
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
