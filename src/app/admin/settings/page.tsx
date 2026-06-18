import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Suspense } from "react";
import LinkedInIntegrationCard from "./LinkedInIntegrationCard";

export const dynamic = "force-dynamic";

export default function AdminSettingsPage() {
  return (
    <Box sx={{ padding: { xs: "24px 16px", md: "40px 32px" }, maxWidth: "900px" }}>
      <Typography
        component="h1"
        sx={{ fontSize: "1.75rem", fontWeight: 700, color: "text.primary", marginBottom: "6px" }}
      >
        Settings
      </Typography>
      <Typography sx={{ fontSize: "0.875rem", color: "custom.accentText", marginBottom: "32px" }}>
        Manage integrations and connected accounts.
      </Typography>

      <Typography
        component="h2"
        sx={{ fontSize: "1rem", fontWeight: 600, color: "text.secondary", marginBottom: "12px" }}
      >
        Integrations
      </Typography>

      {/* useSearchParams inside the card requires a Suspense boundary */}
      <Suspense fallback={null}>
        <LinkedInIntegrationCard />
      </Suspense>
    </Box>
  );
}
