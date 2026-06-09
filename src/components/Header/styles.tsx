"use client";

import { Container } from "@/app/_globalStyles";
import MuiDrawer from "@mui/material/Drawer";
import { styled } from "@mui/material/styles";
import Link from "next/link";

export const HeaderWrapper = styled("div")(({ theme }) => ({
  color: theme.palette.text.secondary,
  borderBottom: `thin solid ${theme.palette.background.paper}`,
  backgroundColor: theme.palette.custom.main60,
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  zIndex: 999,
  top: 0,
  position: "sticky",
  fontSize: "0.875rem",

  "& a": {
    textDecoration: "none",
    color: theme.palette.text.secondary,
  },

  "& .action-item": {
    display: "block",
    cursor: "pointer",
    transition: "all 0.3s ease-in-out",

    "& svg": {
      color: theme.palette.custom.accentText,
    },

    "&:hover": {
      backgroundColor: theme.palette.custom.mainHover,
    },
  },
}));

export const HeaderContainer = styled(Container)(({ theme: _theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  paddingTop: "unset",
  paddingBottom: "unset",
  minHeight: "3rem",

  "& .left": {
    alignSelf: "stretch",
    display: "flex",
    alignItems: "stretch",
  },

  "& .center": {},

  "& .right": {
    gap: "0.25rem",
    display: "flex",
    alignItems: "stretch",
    alignSelf: "stretch",
  },
}));

export const LogoContainer = styled(Link)(({ theme }) => ({
  paddingLeft: "1rem",
  paddingRight: "1rem",
  display: "flex !important",
  alignItems: "center",

  "& h1": {
    margin: "unset",
    fontSize: "initial",
  },

}));

export const NavLinkItem = styled(Link)(({ theme }) => ({
  padding: `${theme.spacing(2)} ${theme.spacing(2)}`,
  position: "relative",

  "& svg": {
    marginRight: "10px",
  },

  "&::after": {
    content: "''",
    position: "absolute",
    bottom: 0,
    left: "50%",
    right: "50%",
    height: "2px",
    background: theme.palette.primary.main,
    transition: "left 300ms, right 300ms",
  },

  "&:hover::after": {
    left: 0,
    right: 0,
  },

  "@media (max-width: 950px)": {
    padding: "10px 15px",

    "& svg": {
      marginRight: "unset",
    },

    "& .text": {
      display: "none",
    },

    "&.action-item:hover": {
      "& svg": {
        marginRight: "10px",
      },
      "& .text": {
        display: "inline-block",
      },
    },
  },
}));

export const NavLinksContainer = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flex: "1 1 0",
  alignSelf: "center",

  [theme.breakpoints.down("md")]: {
    display: "none",
  },
}));

export const HamburgerButton = styled("div")(({ theme }) => ({
  display: "none",
  alignItems: "center",
  paddingLeft: "0.5rem",
  paddingRight: "0.5rem",
  cursor: "pointer",
  transition: "all 0.3s ease-in-out",

  "& svg": {
    color: theme.palette.custom.accentText,
  },

  "&:hover": {
    backgroundColor: theme.palette.custom.mainHover,
  },

  [theme.breakpoints.down("md")]: {
    display: "flex",
    alignSelf: "stretch",
    alignItems: "center",
  },
}));

export const DrawerNavItem = styled(Link)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  minHeight: "56px",
  padding: "0 1.5rem",
  color: theme.palette.text.secondary,
  textDecoration: "none",
  fontSize: "1rem",
  transition: "background-color 0.2s ease",

  "& svg": {
    color: theme.palette.custom.accentText,
    width: "1rem",
    flexShrink: 0,
  },

  "&:hover": {
    backgroundColor: theme.palette.custom.mainHover,
  },
}));

export const MobileDrawer = styled(MuiDrawer)(({ theme }) => ({
  "& .MuiDrawer-paper": {
    width: 260,
    paddingTop: theme.spacing(2),
    backgroundColor: theme.palette.custom.main60,
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderRight: `thin solid ${theme.palette.primary.border}`,
    boxShadow: `4px 0 24px ${theme.palette.primary.alpha20}`,
  },
}));

export const SearchLink = styled(Link)(() => ({
  display: "flex !important",
  alignItems: "center",
  paddingLeft: "0.5rem",
  paddingRight: "0.5rem",
}));

export const ThemeButton = styled("div")(() => ({
  display: "flex !important",
  alignItems: "center",
  paddingLeft: "0.5rem",
  paddingRight: "0.5rem",
}));

export const ProgressBarFill = styled("div")(({ theme }) => ({
  position: "absolute",
  bottom: 0,
  left: 0,
  height: "3px",
  backgroundColor: theme.palette.primary.main,
  boxShadow: `0 0 8px ${theme.palette.primary.alpha20}`,
  transition: "width 150ms linear",
  pointerEvents: "none",
  zIndex: 1,
}));
