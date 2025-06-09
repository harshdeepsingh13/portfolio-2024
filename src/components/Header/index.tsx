"use client";

import { LINK_MAPPING } from "@/config/config";
import { THEME, useThemeContext } from "@/context/ThemeContext";
import { faClipboard, faLightbulb, faMoon } from "@fortawesome/free-regular-svg-icons";
import {
  faDiagramProject,
  faDice,
  faGraduationCap,
  faMagnifyingGlass,
  faUserTie,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { sendGAEvent } from "@next/third-parties/google";
import Logo from "../Logo";
import {
  HeaderContainer,
  HeaderWrapper,
  LogoContainer,
  NavLinkItem,
  NavLinksContainer,
  SearchLink,
  ThemeButton,
} from "./styles";

const NAV_LINKS = [
  { icon: faDice, text: "Skills", to: LINK_MAPPING.SKILLS },
  { icon: faDiagramProject, text: "Projects", to: LINK_MAPPING.PROJECTS },
  { icon: faUserTie, text: "Experiences", to: LINK_MAPPING.EXPERIENCES },
  { icon: faGraduationCap, text: "Education", to: LINK_MAPPING.EDUCATION },
  { icon: faClipboard, text: "Resume", to: LINK_MAPPING.RESUME },
];

const Header = ({ basicInformation }: { basicInformation: any }) => {
  const { theme, setTheme } = useThemeContext();

  const onThemeToggle = () => {
    sendGAEvent("event", "toggle_theme");
    setTheme((prev: string) => {
      if (prev === THEME.LIGHT) return THEME.DARK;
      return THEME.LIGHT;
    });
  };
  return (
    <>
      <HeaderWrapper>
        <HeaderContainer>
          <div className="left">
            <LogoContainer href={LINK_MAPPING.HOME} className={"action-item"}>
              <h1>
                <Logo name={basicInformation?.name} />
              </h1>
            </LogoContainer>
          </div>
          <NavLinksContainer className="center">
            {NAV_LINKS.map(({ text, to, icon }) => (
              <NavLinkItem key={to} href={to} className={"action-item"}>
                <FontAwesomeIcon icon={icon} />
                <span className="text">{text}</span>
              </NavLinkItem>
            ))}
          </NavLinksContainer>
          <div className="right">
            {process.env.REACT_APP_MODE === "dev" && (
              <SearchLink href={LINK_MAPPING.SEARCH} className="action-item">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </SearchLink>
            )}
            <ThemeButton onClick={onThemeToggle} className={"action-item"}>
              <FontAwesomeIcon icon={theme === THEME.DARK ? faMoon : faLightbulb} />
            </ThemeButton>
          </div>
        </HeaderContainer>
      </HeaderWrapper>
    </>
  );
};

export default Header;
