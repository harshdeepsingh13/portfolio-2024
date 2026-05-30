"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { styled, useTheme } from "@mui/material/styles";
import Link from "next/link";
import { usePathname } from "next/navigation";
import EmotionRegistry from "@/lib/emotionRegistry";
import { ThemeContextProvider } from "@/context";

// ── Sidebar styled components ────────────────────────────────────────────────

const AdminLayout = styled(Box)(() => ({
  display: "flex",
  minHeight: "100vh",
}));

const Sidebar = styled(Box)(({ theme }) => ({
  width: "220px",
  flexShrink: 0,
  backgroundColor: theme.palette.background.paper,
  borderRight: `1px solid ${theme.palette.divider}`,
  display: "flex",
  flexDirection: "column",
  padding: "0",
  position: "sticky",
  top: 0,
  height: "100vh",
  overflowY: "auto",
}));

const SidebarHeader = styled(Box)(({ theme }) => ({
  padding: "20px 16px",
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const NavItem = styled("a")<{ active?: boolean }>(({ theme, active }) => ({
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
}));

const MainContent = styled(Box)(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.palette.background.default,
  minWidth: 0,
  overflowX: "auto",
}));

// ── Inner shell (needs theme access) ─────────────────────────────────────────

function AdminSidebarContent() {
  const pathname = usePathname();
  const theme = useTheme();

  const navLinks = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/posts", label: "Posts" },
    { href: "/admin/posts/new", label: "New Post" },
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
              : pathname?.startsWith(link.href);
          return (
            <NavItem key={link.href} href={link.href} active={isActive}>
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
        <NavItem href="/" title="Back to site">
          ← Portfolio
        </NavItem>
      </Box>
    </Sidebar>
  );
}

// ── Exported shell (wraps providers) ─────────────────────────────────────────

export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <EmotionRegistry>
      <ThemeContextProvider>
        <AdminLayout>
          <AdminSidebarContent />
          <MainContent>{children}</MainContent>
        </AdminLayout>
      </ThemeContextProvider>
    </EmotionRegistry>
  );
}
