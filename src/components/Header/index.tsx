"use client";

import { LINK_MAPPING } from "@/config/config";
import { THEME, useThemeContext } from "@/context/ThemeContext";
import { faClipboard, faLightbulb, faMoon } from "@fortawesome/free-regular-svg-icons";
import {
  faBars,
  faDiagramProject,
  faDice,
  faGraduationCap,
  faUserTie,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { sendGAEvent } from "@next/third-parties/google";
import { useState } from "react";
import Logo from "../Logo";
import {
  DrawerNavItem,
  HamburgerButton,
  HeaderContainer,
  HeaderWrapper,
  LogoContainer,
  MobileDrawer,
  NavLinkItem,
  NavLinksContainer,
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
  const [drawerOpen, setDrawerOpen] = useState(false);

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
            <HamburgerButton onClick={() => setDrawerOpen((v) => !v)}>
              <FontAwesomeIcon icon={drawerOpen ? faXmark : faBars} />
            </HamburgerButton>
            <LogoContainer href={LINK_MAPPING.HOME} className={"action-item"}>
              <span>
                <Logo name={basicInformation?.name} />
              </span>
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
            <ThemeButton onClick={onThemeToggle} className={"action-item"}>
              <FontAwesomeIcon icon={theme === THEME.DARK ? faMoon : faLightbulb} />
            </ThemeButton>
          </div>
        </HeaderContainer>
      </HeaderWrapper>

      <MobileDrawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        ModalProps={{ BackdropProps: { invisible: true } }}
      >
        {NAV_LINKS.map(({ text, to, icon }) => (
          <DrawerNavItem key={to} href={to} onClick={() => setDrawerOpen(false)}>
            <FontAwesomeIcon icon={icon} />
            <span>{text}</span>
          </DrawerNavItem>
        ))}
      </MobileDrawer>
    </>
  );
};

export default Header;
