"use client";

import { styled } from "@mui/material/styles";

export const EditorWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  border: `1px solid ${theme.palette.primary.border}`,
  borderRadius: "8px",
  backgroundColor: theme.palette.background.paper,
  minHeight: "400px",

  "&:focus-within": {
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 0 2px ${theme.palette.primary.alpha10}`,
  },

  "& .tiptap-toolbar": {
    display: "flex",
    flexWrap: "wrap",
    gap: "4px",
    padding: "8px 12px",
    borderBottom: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.default,
    position: "sticky",
    top: "3rem",
    zIndex: 10,
    borderRadius: "8px 8px 0 0",
    boxShadow: `0 2px 6px ${theme.palette.primary.alpha10}`,
  },

  "& .toolbar-btn": {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "32px",
    height: "32px",
    padding: "0 6px",
    borderRadius: "4px",
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: "transparent",
    color: theme.palette.text.primary,
    cursor: "pointer",
    fontSize: "0.8rem",
    fontFamily: "inherit",
    transition: "background-color 150ms, border-color 150ms",

    "&:hover": {
      backgroundColor: theme.palette.custom.secondaryHover,
      borderColor: theme.palette.custom.borderHover,
    },

    "&.is-active": {
      backgroundColor: theme.palette.primary.alpha20,
      borderColor: theme.palette.primary.border,
      color: theme.palette.primary.main,
    },
  },

  "& .toolbar-divider": {
    width: "1px",
    height: "24px",
    backgroundColor: theme.palette.divider,
    alignSelf: "center",
    margin: "0 2px",
  },

  "& .ProseMirror": {
    flex: 1,
    padding: "16px 20px",
    minHeight: "360px",
    outline: "none",
    overflowX: "auto",
    color: theme.palette.text.primary,
    fontSize: "1rem",
    lineHeight: 1.8,
    fontFamily: "'Outfit', sans-serif",
    // Override global user-select: none
    userSelect: "text",
    WebkitUserSelect: "text",

    "& p.is-editor-empty:first-child::before": {
      content: "attr(data-placeholder)",
      color: theme.palette.custom.accentText,
      pointerEvents: "none",
      float: "left",
      height: 0,
    },

    "& h1, & h2, & h3, & h4, & h5, & h6": {
      color: theme.palette.text.primary,
      marginTop: "1.4em",
      marginBottom: "0.4em",
      lineHeight: 1.3,
    },

    "& h1": { fontSize: "2em", fontWeight: 900 },
    "& h2": { fontSize: "1.6em", fontWeight: 700 },
    "& h3": { fontSize: "1.3em", fontWeight: 700 },

    "& p": {
      margin: "0 0 0.8em 0",
    },

    "& ul, & ol": {
      paddingLeft: "1.5em",
      margin: "0 0 0.8em 0",
    },

    "& li": {
      marginBottom: "0.3em",
    },

    "& blockquote": {
      borderLeft: `3px solid ${theme.palette.primary.main}`,
      paddingLeft: "1em",
      margin: "1em 0",
      color: theme.palette.custom.tertiaryText,
      fontStyle: "italic",
    },

    "& hr": {
      border: "none",
      borderTop: `1px solid ${theme.palette.divider}`,
      margin: "1.5em 0",
    },

    "& a": {
      color: theme.palette.primary.main,
      textDecoration: "underline",
      cursor: "pointer",
    },

    "& code": {
      fontFamily: "source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace",
      backgroundColor: theme.palette.custom.tertiary,
      color: theme.palette.primary.main,
      padding: "2px 5px",
      borderRadius: "4px",
      fontSize: "0.875em",
    },

    "& pre": {
      backgroundColor: theme.palette.custom.tertiary,
      borderRadius: "6px",
      padding: "1em 1.2em",
      margin: "1em 0",
      overflowX: "auto",
      border: `1px solid ${theme.palette.divider}`,

      "& code": {
        backgroundColor: "transparent",
        color: theme.palette.text.primary,
        padding: 0,
        fontSize: "0.875em",
      },

      "& .hljs-keyword, & .hljs-built_in": { color: "#bd2864" },
      "& .hljs-string, & .hljs-attr": { color: "#98c379" },
      "& .hljs-function": { color: "#52a8ff" },
      "& .hljs-number": { color: "#f8c555" },
      "& .hljs-comment": { color: "#6a9955", fontStyle: "italic" },
    },

    "& img": {
      maxWidth: "100%",
      borderRadius: "4px",
      margin: "1em 0",
    },

    "& table": {
      borderCollapse: "collapse",
      width: "100%",
      margin: "1em 0",

      "& th, & td": {
        border: `1px solid ${theme.palette.divider}`,
        padding: "8px 12px",
        textAlign: "left",
        userSelect: "text",
        WebkitUserSelect: "text",
      },

      "& th": {
        backgroundColor: theme.palette.custom.tertiary,
        fontWeight: 700,
        color: theme.palette.text.primary,
      },

      "& td": {
        color: theme.palette.text.secondary,
      },
    },
  },

  "& .bubble-menu": {
    display: "flex",
    gap: "4px",
    padding: "6px 8px",
    borderRadius: "6px",
    border: `1px solid ${theme.palette.primary.border}`,
    backgroundColor: theme.palette.background.paper,
    boxShadow: `0 4px 16px ${theme.palette.primary.alpha20}`,
  },
}));

export const CharCountWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  padding: "4px 12px",
  borderTop: `1px solid ${theme.palette.divider}`,
  fontSize: "0.75rem",
  color: theme.palette.custom.accentText,
}));
