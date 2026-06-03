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
            height: 100%;
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

          /* ── Blog post reader ──────────────────────────────────────── */
          .blog-post-body {
            user-select: text;
            -webkit-user-select: text;
          }
          .blog-post-body * {
            user-select: text;
            -webkit-user-select: text;
          }

          /* Headings */
          .blog-post-body h2,
          .blog-post-body h3,
          .blog-post-body h4,
          .blog-post-body h5,
          .blog-post-body h6 {
            font-family: 'Outfit', sans-serif;
            font-weight: 700;
            line-height: 1.3;
            margin: 2em 0 0.5em;
          }
          .blog-post-body h2 { font-size: 1.65rem; }
          .blog-post-body h3 { font-size: 1.35rem; }
          .blog-post-body h4 { font-size: 1.1rem; font-weight: 600; }

          /* Body text */
          .blog-post-body p { margin: 0 0 1.25em; }
          .blog-post-body ul,
          .blog-post-body ol { padding-left: 1.75em; margin: 0 0 1.25em; }
          .blog-post-body li { margin-bottom: 0.4em; }

          /* Blockquote */
          .blog-post-body blockquote {
            border-left: 3px solid;
            padding: 0.25em 0 0.25em 1.25em;
            margin: 1.5em 0;
            font-style: italic;
          }

          /* Rule */
          .blog-post-body hr {
            border: none;
            border-top: 1px solid;
            margin: 2.5em 0;
          }

          /* Images */
          .blog-post-body img {
            max-width: 100%;
            border-radius: 8px;
            margin: 1.5em 0;
            display: block;
          }

          /* Inline code (not inside pre) */
          .blog-post-body :not(pre) > code {
            font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
            font-size: 0.875em;
            padding: 2px 6px;
            border-radius: 4px;
            word-break: break-word;
          }

          /* Code blocks — always dark, regardless of page theme */
          .blog-post-body pre {
            background: #0d1117;
            border: 1px solid #30363d;
            border-radius: 10px;
            padding: 1.25em 1.5em;
            overflow-x: auto;
            margin: 1.75em 0;
            line-height: 1.65;
            -webkit-overflow-scrolling: touch;
          }

          /* Language badge (added via data-language by sanitize.ts) */
          .blog-post-body pre[data-language]::before {
            content: attr(data-language);
            display: block;
            padding-bottom: 0.65em;
            margin-bottom: 0.65em;
            border-bottom: 1px solid #30363d;
            font-size: 0.7em;
            font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
            color: #8b949e;
            text-transform: uppercase;
            letter-spacing: 0.12em;
            user-select: none;
          }

          .blog-post-body pre code {
            font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
            background: transparent !important;
            color: #e6edf3;
            padding: 0;
            font-size: 0.875em;
            border-radius: 0;
          }

          /* Syntax tokens (highlight.js) */
          .blog-post-body pre .hljs-keyword,
          .blog-post-body pre .hljs-built_in      { color: #ff7b72; }
          .blog-post-body pre .hljs-string,
          .blog-post-body pre .hljs-attr          { color: #a5d6ff; }
          .blog-post-body pre .hljs-function,
          .blog-post-body pre .hljs-title         { color: #d2a8ff; }
          .blog-post-body pre .hljs-number,
          .blog-post-body pre .hljs-literal       { color: #f8c555; }
          .blog-post-body pre .hljs-comment       { color: #8b949e; font-style: italic; }
          .blog-post-body pre .hljs-variable,
          .blog-post-body pre .hljs-class         { color: #ffa657; }
          .blog-post-body pre .hljs-operator,
          .blog-post-body pre .hljs-punctuation   { color: #79c0ff; }

          /* Tables */
          .blog-post-body table {
            border-collapse: collapse;
            width: 100%;
            margin: 1.75em 0;
            font-size: 0.95em;
            display: block;
            overflow-x: auto;
          }
          .blog-post-body th,
          .blog-post-body td {
            padding: 10px 14px;
            text-align: left;
            border: 1px solid;
            vertical-align: top;
          }
          .blog-post-body th { font-weight: 700; }

          /* YouTube / video embeds */
          .blog-post-body iframe {
            max-width: 100%;
            border-radius: 10px;
            border: none;
          }

          /* Inline chip labels */
          .blog-post-body .tiptap-chip {
            display: inline-block;
            font-size: 0.8em;
            padding: 2px 8px;
            border-radius: 50px;
            cursor: default;
            user-select: none;
            vertical-align: middle;
            margin: 0 2px;
            white-space: nowrap;
            line-height: 1.5;
          }
          html[data-theme="dark"]  .blog-post-body .tiptap-chip {
            border: 1px solid rgba(56,189,248,0.15);
            color: #38bdf8;
            background-color: rgba(56,189,248,0.08);
          }
          html[data-theme="light"] .blog-post-body .tiptap-chip {
            border: 1px solid rgba(2,132,199,0.2);
            color: #0284c7;
            background-color: rgba(2,132,199,0.08);
          }

          /* Theme-dependent colours */
          html[data-theme="dark"]  .blog-post-body a { color: #38bdf8; }
          html[data-theme="light"] .blog-post-body a { color: #0284c7; }
          html[data-theme="dark"]  .blog-post-body a:hover { color: #7dd3fc; }
          html[data-theme="light"] .blog-post-body a:hover { color: #0369a1; }

          html[data-theme="dark"]  .blog-post-body blockquote { border-color: #38bdf8; color: #c1c1c1; }
          html[data-theme="light"] .blog-post-body blockquote { border-color: #0284c7; color: #3e3e3e; }

          html[data-theme="dark"]  .blog-post-body hr { border-color: #2e2e2e; }
          html[data-theme="light"] .blog-post-body hr { border-color: #d1d1d1; }

          html[data-theme="dark"]  .blog-post-body :not(pre) > code {
            background: rgba(56,189,248,0.12);
            color: #38bdf8;
          }
          html[data-theme="light"] .blog-post-body :not(pre) > code {
            background: rgba(2,132,199,0.10);
            color: #0284c7;
          }

          html[data-theme="dark"]  .blog-post-body th { background: #161b22; color: #e6edf3; border-color: #30363d; }
          html[data-theme="light"] .blog-post-body th { background: #e1e1e1; color: #121212;  border-color: #d1d1d1; }
          html[data-theme="dark"]  .blog-post-body td { color: #e1e1e1; border-color: #2e2e2e; }
          html[data-theme="light"] .blog-post-body td { color: #1e1e1e; border-color: #d1d1d1; }
          html[data-theme="dark"]  .blog-post-body tr:nth-child(even) td { background: rgba(255,255,255,0.02); }
          html[data-theme="light"] .blog-post-body tr:nth-child(even) td { background: rgba(0,0,0,0.02); }
        `,
      },
    },
  });
};
