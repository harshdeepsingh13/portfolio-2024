"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { styled, useTheme } from "@mui/material/styles";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavGuardWindow = Window & { __adminNavGuard?: () => boolean };

function checkNavGuard(e: React.MouseEvent): void {
  const guard = (window as NavGuardWindow).__adminNavGuard;
  if (guard && !guard()) e.preventDefault();
}

// ── Constants ─────────────────────────────────────────────────────────────────

const NAVBAR_HEIGHT = "3rem";
const FOOTER_HEIGHT = "5rem";
const SIDEBAR_WIDTH = "220px";

// ── Sidebar styled components ────────────────────────────────────────────────

const AdminLayout = styled(Box)(() => ({
  display: "flex",
  minHeight: `calc(100vh - ${NAVBAR_HEIGHT} - ${FOOTER_HEIGHT})`,
}));

const Sidebar = styled(Box)(({ theme }) => ({
  width: SIDEBAR_WIDTH,
  flexShrink: 0,
  backgroundColor: theme.palette.background.paper,
  borderRight: `1px solid ${theme.palette.divider}`,
  display: "flex",
  flexDirection: "column",
  padding: "0",
  position: "fixed",
  top: NAVBAR_HEIGHT,
  height: `calc(100vh - ${NAVBAR_HEIGHT})`,
  overflowY: "auto",
  zIndex: 100,
}));

const SidebarHeader = styled(Box)(({ theme }) => ({
  padding: "20px 16px",
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const NavItem = styled(Link, { shouldForwardProp: (p) => p !== "active" })<{ active?: boolean }>(
  ({ theme, active }) => ({
    display: "block",
    padding: "10px 16px",
    color: active ? theme.palette.primary.main : theme.palette.custom.tertiaryText,
    textDecoration: "none",
    fontSize: "0.875rem",
    fontFamily: "'Outfit', sans-serif",
    borderRadius: "6px",
    margin: "2px 8px",
    backgroundColor: active ? theme.palette.primary.alpha10 : "transparent",
    border: active ? `1px solid ${theme.palette.primary.border}` : "1px solid transparent",
    transition: "background-color 150ms, color 150ms, border-color 150ms",

    "&:hover": {
      backgroundColor: theme.palette.custom.secondaryHover,
      color: theme.palette.text.primary,
    },
  }),
);

const MainContent = styled(Box)(({ theme }) => ({
  flex: 1,
  marginLeft: SIDEBAR_WIDTH,
  backgroundColor: theme.palette.background.default,
  minWidth: 0,
  minHeight: `calc(100vh - ${NAVBAR_HEIGHT} - ${FOOTER_HEIGHT})`,
  overflowX: "clip",
}));

// ── Sidebar content ───────────────────────────────────────────────────────────

function AdminSidebarContent() {
  const pathname = usePathname();
  const theme = useTheme();

  const navLinks = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/posts", label: "Posts" },
    { href: "/admin/posts/new", label: "New Post" },
    { href: "/admin/settings", label: "Settings" },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "0.95rem",
            color: theme.palette.primary.main,
            letterSpacing: "0.5px",
          }}
        >
          Admin
        </Typography>
        <Typography
          sx={{
            fontSize: "0.7rem",
            color: theme.palette.custom.accentText,
            marginTop: "2px",
          }}
        >
          Blog Management
        </Typography>
      </SidebarHeader>

      <Box sx={{ flex: 1, py: 1 }}>
        {navLinks.map((link) => {
          const isActive =
            link.href === "/admin"
              ? pathname === "/admin"
              : link.href === "/admin/posts"
                ? pathname === "/admin/posts" ||
                  (pathname.startsWith("/admin/posts/") && !pathname.startsWith("/admin/posts/new"))
                : pathname === link.href;
          return (
            <NavItem key={link.href} href={link.href} active={isActive} onClick={checkNavGuard}>
              {link.label}
            </NavItem>
          );
        })}
      </Box>

      <Box
        sx={{
          padding: "12px 8px",
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <NavItem href="/" title="Back to site" onClick={checkNavGuard}>
          ← Portfolio
        </NavItem>
      </Box>
    </Sidebar>
  );
}

// ── Exported shell ────────────────────────────────────────────────────────────

export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <AdminLayout>
      <AdminSidebarContent />
      <MainContent>{children}</MainContent>
    </AdminLayout>
  );
}
