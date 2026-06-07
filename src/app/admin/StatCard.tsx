"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <Box
      sx={(theme) => ({
        flex: "1 1 180px",
        minWidth: "160px",
        padding: "24px 20px",
        borderRadius: "10px",
        backgroundColor: theme.palette.background.paper,
        border: "1px solid",
        borderColor: accent ? theme.palette.primary.border : theme.palette.divider,
        background: accent ? theme.palette.primary.glow : undefined,
        boxShadow: accent ? `0 4px 16px ${theme.palette.primary.alpha10}` : undefined,
      })}
    >
      <Typography
        sx={{
          fontSize: "2.25rem",
          fontWeight: 900,
          color: accent ? "primary.main" : "text.primary",
          lineHeight: 1,
          marginBottom: "6px",
        }}
      >
        {value}
      </Typography>
      <Typography
        sx={{
          fontSize: "0.8rem",
          color: "custom.accentText",
          textTransform: "uppercase",
          letterSpacing: "0.8px",
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}
