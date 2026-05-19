import { styled } from "@mui/material/styles";

export const TimelinePointWrapper = styled("div")(({ theme }) => ({
  height: "50px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.palette.background.default,
  color: theme.palette.custom.accentText,
  zIndex: 2,
  [theme.breakpoints.down("lg")]: {
    display: "none",
  },
}));
