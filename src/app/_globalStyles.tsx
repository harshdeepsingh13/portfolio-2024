// NOTE: CustomTabs/CustomTab now use MUI API.
// Usage: <CustomTabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
//          <CustomTab value="key" label="Label" />
//        </CustomTabs>
// Render tab content separately based on activeTab value.

import { forwardRef } from "react";
import { styled } from "@mui/material/styles";
import MuiContainer from "@mui/material/Container";
import Grid2 from "@mui/material/Grid";
import type { GridProps as Grid2Props } from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import type { TypographyProps } from "@mui/material/Typography";
import MuiTabs from "@mui/material/Tabs";
import type { TabsProps } from "@mui/material/Tabs";
import MuiTab from "@mui/material/Tab";
import { fadeSlideUp } from "@/theme/animations";

export const Container = styled(MuiContainer)(({ theme }) => ({
  maxWidth: "1200px !important",
  minWidth: "1200px",
  margin: "0px auto",
  padding: "3rem 15px",
  width: "100%",

  [theme.breakpoints.down(1350)]: {
    maxWidth: "1000px !important",
    minWidth: "1000px",
  },

  [theme.breakpoints.down(1075)]: {
    maxWidth: "-webkit-fill-available !important",
    minWidth: "-webkit-fill-available",
  },
}));

const RowBase = forwardRef<HTMLDivElement, Grid2Props>((props, ref) => (
  <Grid2 container ref={ref} {...props} />
));
RowBase.displayName = "Row";

export const Row = styled(RowBase)(() => ({
  width: "100%",
}));

const PageHeaderBase = forwardRef<HTMLHeadingElement, TypographyProps>(
  (props, ref) => (
    <Typography ref={ref} component="h1" variant="h1" {...props} />
  )
);
PageHeaderBase.displayName = "PageHeader";

export const PageHeader = styled(PageHeaderBase)(({ theme }) => ({
  fontFamily: "'Outfit', sans-serif",
  fontSize: "2.5em",
  margin: "unset",
  letterSpacing: "-1px",
  fontWeight: 900,
  color: theme.palette.text.secondary,
  textAlign: "center",
  animation: `${fadeSlideUp} 0.6s ease both`,

  [theme.breakpoints.up(640)]: {
    fontSize: "3em",
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "3.5em",
  },
  [theme.breakpoints.up(1024)]: {
    fontSize: "4em",
  },
}));

export const PageLead = styled(Typography)(({ theme }) => ({
  margin: "1rem auto",
  maxWidth: "760px",
  textAlign: "center",
  color: theme.palette.custom.tertiaryText,
  fontWeight: 300,
  lineHeight: 1.8,
  letterSpacing: "0.2px",
  animation: `${fadeSlideUp} 0.6s 0.1s ease both`,

  [theme.breakpoints.up("md")]: {
    textAlign: "center",
  },
}));

export const BreadcrumbsNav = styled("nav")(({ theme }) => ({
  marginBottom: "1rem",
  color: theme.palette.custom.tertiaryText,
  fontSize: "0.85rem",
}));

export const BreadcrumbsList = styled("ol")(() => ({
  display: "flex",
  flexWrap: "wrap" as const,
  gap: "0.35rem",
  listStyle: "none",
  padding: 0,
  margin: 0,
}));

export const BreadcrumbItem = styled("li")(({ theme }) => ({
  display: "flex",
  alignItems: "center",

  "&:not(:last-child)::after": {
    content: '"/"',
    marginLeft: "0.35rem",
    color: theme.palette.custom.accentText,
  },
}));

export const BreadcrumbLink = styled("a")(({ theme }) => ({
  color: "inherit",
  textDecoration: "none",

  "&:hover": {
    color: theme.palette.custom.mainHover,
    textDecoration: "underline",
  },
}));

const CardTitleBase = forwardRef<HTMLHeadingElement, TypographyProps>(
  (props, ref) => (
    <Typography ref={ref} component="h4" variant="h4" {...props} />
  )
);
CardTitleBase.displayName = "CardTitle";

export const CardTitle = styled(CardTitleBase)(() => ({
  margin: "5px 0",
  fontSize: "1.01em",
}));

const StyledTabs = styled(MuiTabs)(({ theme }) => ({
  margin: "2em 0 1em 0",
  "& .MuiTabs-flexContainer": {
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "0.5rem",
  },
  "& .MuiTabs-indicator": {
    display: "none",
  },
  "& .MuiTab-root": {
    color: theme.palette.custom.accentText,
    borderRadius: "50px",
    padding: "6px 16px",
    minHeight: "unset",
    textTransform: "none",
    "@media (max-width: 460px)": {
      fontSize: "0.8em",
    },
  },
  "& .Mui-selected": {
    backgroundColor: theme.palette.custom.accentText,
    color: theme.palette.background.default,
  },
}));

export const CustomTabs = (props: TabsProps) => (
  <StyledTabs centered textColor="inherit" {...props} />
);

export const CustomTab = styled(MuiTab)(() => ({}));
