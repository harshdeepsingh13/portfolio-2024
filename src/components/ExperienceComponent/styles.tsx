import { CardTitle, Row } from "@/app/_globalStyles";
import { fadeIn } from "@/theme/animations";
import { styled } from "@mui/material/styles";
import Card from "../Card";

export const ExperiencesWrapper = styled("div")({
  display: "flex",
  position: "relative",
  flexDirection: "column",
  alignItems: "center",
  padding: "2em 0",
  marginTop: "2rem",
  gap: "1.2em",

  "@media (max-width: 992px)": {
    marginTop: "1em",
    paddingTop: "unset",
  },
});

export const TimelineDivider = styled("div")(({ theme }) => ({
  position: "absolute",
  top: 0,
  bottom: 0,
  width: "1px",
  background: `linear-gradient(to bottom, transparent, ${theme.palette.primary.main}, transparent)`,
  border: "none",

  "@media (max-width: 992px)": {
    display: "none",
  },
}));

export const ExperienceRow = styled(Row)({
  justifyContent: "space-between",
  alignItems: "center",
});

export const ExperienceItem = styled(Card, {
  shouldForwardProp: (prop) => prop !== "delay",
})<{ delay?: number }>(({ delay = 0 }) => ({
  width: "calc(50% - 32px) !important",
  margin: "unset",
  animation: `${fadeIn} 0.6s ease both`,
  animationDelay: `${delay}s`,

  "@media (max-width: 992px)": {
    "&.hidden": {
      display: "none",
    },
    width: "100% !important",
  },
}));

export const Position = styled(CardTitle)({
  fontSize: "1.2em",
  fontWeight: 500,
  margin: "10px 0",
});

export const SecondaryInformation = styled("h5")(({ theme }) => ({
  margin: "10px 0",
  fontSize: "0.9em",
  fontWeight: 400,
  color: theme.palette.custom.tertiaryText,
  display: "flex",

  "& svg": {
    marginRight: "1em",
  },
}));

export const Responsibilities = styled("div")(({ theme }) => ({
  margin: "15px 0",
  fontSize: "0.9em",
  fontWeight: 400,
  color: theme.palette.custom.tertiaryText,

  "& ul": {
    paddingLeft: "1rem",

    "& li": {
      marginBottom: "5px",
    },
  },
}));
