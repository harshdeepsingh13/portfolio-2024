import { Container, PageHeader } from "@/app/_globalStyles";
import { blink, fadeIn, fadeSlideUp, scanAnim } from "@/theme/animations";
import Grid2 from "@mui/material/Grid";
import { styled } from "@mui/material/styles";

export const HomeWrapper = styled(Container)({
  flex: "1 1 0%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
  isolation: "isolate",
});

export const ScanContainer = styled("div")({
  position: "absolute",
  inset: 0,
  overflow: "hidden",
  pointerEvents: "none",
});

export const ScanLine = styled("div")(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  height: "1px",
  background: theme.palette.primary.scanLineBg,
  animation: `${scanAnim} 8s linear infinite`,
  transition: "none",
}));

export const HeroContent = styled("div")({
  position: "relative",
  zIndex: 1,
  width: "100%",
});

export const Name = styled(PageHeader)({
  "@media (min-width: 768px)": {
    fontSize: "3.5em",
    textAlign: "left",
  },
});

export const ProfessionalSummary = styled("div")(({ theme }) => ({
  color: theme.palette.custom.tertiaryText,
  fontWeight: 300,
  fontSize: "0.8em",
  padding: "10px 0",
  animation: `${fadeSlideUp} 0.6s 0.3s ease both`,

  "@media (min-width: 768px)": {
    fontSize: "1em",
  },
}));

export const SocialMediaContainer = styled("div")(({ theme }) => ({
  display: "flex",
  gap: "0.5rem",
  padding: "10px 0",
  color: theme.palette.custom.accentText,
  alignItems: "center",
  justifyContent: "center",
  animation: `${fadeSlideUp} 0.6s 0.5s ease both`,

  "@media (min-width: 768px)": {
    justifyContent: "flex-start",
  },

  "& a": {
    color: "inherit",
    textDecoration: "none",
  },
}));

export const SocialMediaItem = styled("a")(({ theme }) => ({
  "& svg": {
    width: "20px",
    height: "20px",
  },

  "&:hover": {
    color: theme.palette.custom.accentTextHover,
  },
}));

export const TypewriterCursor = styled("span")(({ theme }) => ({
  display: "inline-block",
  width: "3px",
  height: "0.85em",
  background: theme.palette.primary.main,
  marginLeft: "4px",
  verticalAlign: "middle",
  animation: `${blink} 1s step-end infinite`,
}));

export const StatsPanel = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  height: "100%",
  justifyContent: "center",
  padding: "1rem 0",
  animation: `${fadeSlideUp} 0.6s 0.4s ease both`,
});

export const StatsPanelLabel = styled("div")(({ theme }) => ({
  fontSize: "0.7em",
  fontWeight: 500,
  letterSpacing: "3px",
  textTransform: "uppercase",
  color: theme.palette.primary.main,
  opacity: 0.7,
  marginBottom: "4px",
}));

export const StatsGrid = styled("div")({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "10px",
});

export const StatCard = styled("div", {
  shouldForwardProp: (prop) => prop !== "delay",
})<{ delay?: number }>(({ theme, delay = 0 }) => ({
  background: theme.palette.primary.glow,
  animation: `${fadeIn} 0.5s ease both`,
  animationDelay: `${delay}s`,
  border: `1px solid ${theme.palette.primary.border}`,
  borderRadius: "12px",
  padding: "16px 12px",
  textAlign: "center",
  transition: "border-color 300ms, box-shadow 300ms, transform 250ms ease",
  cursor: "pointer",

  "&:hover": {
    borderColor: theme.palette.primary.alpha20,
    boxShadow: `0 0 24px ${theme.palette.primary.alpha10}, 0 4px 16px rgba(0, 0, 0, 0.2)`,
    transform: "translateY(-4px) scale(1.03)",
  },
}));

export const StatNum = styled("div")(({ theme }) => ({
  fontFamily: "'Outfit', sans-serif",
  fontSize: "2em",
  fontWeight: 900,
  color: theme.palette.primary.main,
  lineHeight: 1,
}));

export const StatLabel = styled("div")(({ theme }) => ({
  fontSize: "0.65em",
  fontWeight: 300,
  color: theme.palette.custom.tertiaryText,
  letterSpacing: "2px",
  textTransform: "uppercase",
  marginTop: "4px",
}));

export const ResumeBtn = styled("a")(({ theme }) => ({
  display: "block",
  textAlign: "center",
  padding: "10px",
  border: `1px solid ${theme.palette.primary.border}`,
  borderRadius: "10px",
  color: theme.palette.primary.main,
  fontWeight: 600,
  fontSize: "0.8em",
  letterSpacing: "2px",
  textTransform: "uppercase",
  textDecoration: "none",
  background: theme.palette.primary.glow,
  transition: "background 300ms, border-color 300ms, box-shadow 300ms, transform 250ms ease",

  "&:hover": {
    borderColor: theme.palette.primary.alpha20,
    boxShadow: `0 0 24px ${theme.palette.primary.alpha10}, 0 4px 16px rgba(0, 0, 0, 0.2)`,
    color: theme.palette.primary.main,
    transform: "translateY(-4px) scale(1.03)",
  },
}));

export const DetailsColumn = styled(Grid2)(({ theme }) => ({
  textAlign: "center",

  "& .freelancer-at-toptal": {
    color: theme.palette.custom.tertiaryText,
    margin: "1.5em 0",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",

    "&:hover": {
      transform: "scale(1.01)",
      color: theme.palette.custom.tertiaryTextHover,
    },

    "& img": {
      width: "150px",
    },
  },

  "@media (min-width: 768px)": {
    textAlign: "left",
  },
}));
