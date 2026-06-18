"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { useSearchParams } from "next/navigation";
import { LINKEDIN_API } from "@/services/integrations/linkedin";
import { useDisconnectLinkedIn, useLinkedInStatus } from "@/hooks/integrations/useLinkedIn";

function formatDate(iso?: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function LinkedInIntegrationCard() {
  const theme = useTheme();
  const searchParams = useSearchParams();
  const { data: status, isLoading } = useLinkedInStatus();
  const disconnect = useDisconnectLinkedIn();

  const banner = searchParams.get("linkedin");
  const reason = searchParams.get("reason");

  const connected = status?.connected ?? false;
  const expired = status?.expired ?? false;

  // ── Status pill ─────────────────────────────────────────────────────────
  let dotColor = theme.palette.custom.accentText;
  let label = "Not connected";
  if (connected && expired) {
    dotColor = theme.palette.warning.main;
    label = "Connection expired";
  } else if (connected) {
    dotColor = theme.palette.success.main;
    label = `Connected${status?.displayName ? ` as ${status.displayName}` : ""}`;
  }

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: "10px",
        padding: "24px",
        maxWidth: "560px",
      }}
    >
      <Typography sx={{ fontWeight: 600, fontSize: "1rem", color: "text.primary", mb: "4px" }}>
        LinkedIn
      </Typography>
      <Typography sx={{ fontSize: "0.8rem", color: "custom.accentText", mb: "16px" }}>
        Share published posts to your LinkedIn feed as a link post that drives traffic back to the
        blog. Tokens expire about every 60 days — reconnect here when that happens.
      </Typography>

      {/* Redirect banner */}
      {banner === "connected" && (
        <Typography
          sx={{
            fontSize: "0.8rem",
            color: "success.main",
            backgroundColor: "rgba(76,175,80,0.08)",
            border: "1px solid rgba(76,175,80,0.25)",
            borderRadius: "6px",
            padding: "8px 12px",
            mb: "16px",
          }}
        >
          ✓ LinkedIn connected successfully.
        </Typography>
      )}
      {banner === "error" && (
        <Typography
          sx={{
            fontSize: "0.8rem",
            color: "error.main",
            backgroundColor: "rgba(244,67,54,0.08)",
            border: "1px solid rgba(244,67,54,0.25)",
            borderRadius: "6px",
            padding: "8px 12px",
            mb: "16px",
          }}
        >
          Couldn’t connect LinkedIn{reason ? ` (${reason})` : ""}. Please try again.
        </Typography>
      )}

      {/* Status row */}
      <Box sx={{ display: "flex", alignItems: "center", gap: "8px", mb: "20px" }}>
        <Box sx={{ width: 9, height: 9, borderRadius: "50%", backgroundColor: dotColor, flexShrink: 0 }} />
        <Typography sx={{ fontSize: "0.875rem", color: "text.primary" }}>
          {isLoading ? "Checking…" : label}
        </Typography>
        {connected && !expired && status?.expiresAt && (
          <Typography sx={{ fontSize: "0.8rem", color: "custom.accentText" }}>
            · expires {formatDate(status.expiresAt)}
          </Typography>
        )}
      </Box>

      {/* Actions */}
      <Box sx={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <Button
          // Plain top-level navigation (server 302 → LinkedIn). Avoids the CSP
          // form-action restriction that a form POST would hit.
          component="a"
          href={LINKEDIN_API.connect}
          variant="contained"
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.background.default,
            fontWeight: 600,
            textTransform: "none",
            borderRadius: "8px",
            fontSize: "0.85rem",
            "&:hover": { filter: "brightness(0.9)" },
          }}
        >
          {connected ? "Reconnect" : "Connect LinkedIn"}
        </Button>

        {connected && (
          <Button
            onClick={() => disconnect.mutate()}
            disabled={disconnect.isPending}
            variant="outlined"
            sx={{
              borderColor: "error.main",
              color: "error.main",
              fontWeight: 500,
              textTransform: "none",
              borderRadius: "8px",
              fontSize: "0.85rem",
              "&:hover": { borderColor: "error.dark", backgroundColor: "rgba(244,67,54,0.06)" },
            }}
          >
            {disconnect.isPending ? "Disconnecting…" : "Disconnect"}
          </Button>
        )}
      </Box>
    </Box>
  );
}
