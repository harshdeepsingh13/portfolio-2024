import React, {useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import {
    HeaderContainer,
    HeaderWrapper,
    LogoContainer,
    NavLinkItem,
    NavLinksContainer,
    SearchLink,
    ThemeButton
} from "./styles";
import {THEME, useThemeContext} from "../../context/ThemeContext/ThemeContext";
import Logo from "../Logo";
import {LINK} from "../../config/config";
import {
    faDiagramProject,
    faDice,
    faGraduationCap,
    faMagnifyingGlass,
    faUserTie
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClipboard, faLightbulb, faMoon} from "@fortawesome/free-regular-svg-icons";
import {useUserDetailsContext} from "../../context/UserDetailsContext";
import FullPageLoader from "../FullPageLoader";
import ReactGA from "react-ga4";

const NAV_LINKS = [
    {icon: faDice, text: "Skills", to: LINK.SKILLS},
    {icon: faDiagramProject, text: "Projects", to: LINK.PROJECTS},
    {icon: faUserTie, text: "Experiences", to: LINK.EXPERIENCES},
    {icon: faGraduationCap, text: "Education", to: LINK.EDUCATION},
    {icon: faClipboard, text: "Resume", to: LINK.RESUME}
]

const Header = props => {

    const {theme, setTheme} = useThemeContext();
    const {state, actions, loaders} = useUserDetailsContext();

    let isMounted = useRef(false);

    useEffect(() => {
        if (!isMounted.current) {
            if (!state?.basicInformation) {
                actions.getBasicInformation();
            }
            isMounted.current = true;
        }
    }, []);


    const onThemeToggle = () => {
        ReactGA.event("toggle_theme", {event_name: "toggle_theme"})
        setTheme(prev => {
            if (prev === THEME.LIGHT) return THEME.DARK
            return THEME.LIGHT
        })
    }

    return <>
        {
            loaders.getBasicInformationLoader &&
            <FullPageLoader/>
        }
        <HeaderWrapper>
            <HeaderContainer>
                <div className="left">
                    <LogoContainer to={LINK.HOME} className={"action-item"}>
                        <h1>
                            <Logo name={state?.basicInformation?.name}/>
                        </h1>
                    </LogoContainer>
                </div>
                <NavLinksContainer className="center">
                    {NAV_LINKS.map(({text, to, icon}) => (
                        <NavLinkItem to={to} className={"action-item"}>
                            <FontAwesomeIcon icon={icon}/>
                            <span className="text">{text}</span>
                        </NavLinkItem>
                    ))}
                </NavLinksContainer>
                <div className="right">
                    {process.env.REACT_APP_MODE === "dev" &&
                        <SearchLink to={LINK.SEARCH} className="action-item">
                            <FontAwesomeIcon icon={faMagnifyingGlass}/>
                        </SearchLink>
                    }
                    <ThemeButton onClick={onThemeToggle} className={"action-item"}>
                        <FontAwesomeIcon icon={theme === THEME.DARK ? faMoon : faLightbulb}/>
                    </ThemeButton>
                </div>
            </HeaderContainer>
        </HeaderWrapper>
    </>
};

Header.propTypes = {
    props: PropTypes.object
};
Header.defaultProps = {
    props: {}
};

export default Header
