import MuiButton from "@mui/material/Button";
import { styled } from "@mui/material/styles";

export const DownloadButton = styled(MuiButton)(({ theme }) => ({
  textAlign: "center",
  margin: "3.5em auto",
  display: "block",
  width: "300px",
  borderRadius: "unset",
  padding: "10px",
  backgroundColor: theme.palette.text.primary,
  color: theme.palette.background.default,
  "& svg": {
    marginRight: "1em",
  },
  "&:hover, &:active": {
    backgroundColor: `${theme.palette.text.secondary} !important`,
    color: `${theme.palette.custom.mainHover} !important`,
  },
}));
