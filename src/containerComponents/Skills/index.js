import React, {useCallback, useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {Container, PageHeader} from "../../GlobalStyles";
import {useUserDetailsContext} from "../../context/UserDetailsContext";
import FullPageLoader from "../../components/FullPageLoader";
import {SkillItem, SkillsRow, SkillsWrapper} from "./styles";
import ReactGA from "react-ga4";
import {LINK} from "../../config/config";

export const SKILLS = [
  {TEXT: "HTML", LOGO: "assets/logos/html.svg"},
  {TEXT: "CSS", LOGO: "assets/logos/css.svg"},
  {TEXT: "SASS", LOGO: "assets/logos/sass.svg"},
  {TEXT: "Styled Components", LOGO: "assets/logos/styled-components.svg"},
  {TEXT: "JavaScript", LOGO: "assets/logos/js.png"},
  {TEXT: "TypeScript", LOGO: "assets/logos/ts.png"},
  {TEXT: "React", LOGO: "assets/logos/react.svg"},
  {TEXT: "ExpressJS", LOGO: "assets/logos/express.svg"},
  {TEXT: "Node", LOGO: "assets/logos/node.svg"},
  {TEXT: "MongoDB", LOGO: "assets/logos/mongodb.svg"},
  {TEXT: "AWS", LOGO: "assets/logos/aws.svg"},
  {TEXT: "Nginx", LOGO: "assets/logos/nginx.svg"},
  {TEXT: "MySQL", LOGO: "assets/logos/mysql.svg"},
  {TEXT: "Google Analytics", LOGO: "assets/logos/google-analytics.svg"},
  {TEXT: "JAVA", LOGO: "assets/logos/java.svg"},
  {TEXT: "Spring Boot", LOGO: "assets/logos/spring-boot.svg"},
  {TEXT: "Vite", LOGO: "assets/logos/vitejs.svg"},
  {TEXT: "Chart.js", LOGO: "assets/logos/chartjs.svg"},
]

const Skills = props => {

  const [mySkills, setMySkills] = useState([])

  const {state, actions, loaders} = useUserDetailsContext();

  let isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      ReactGA.send({hitType: "pageview", page: LINK.SKILLS, title: "Skills Page"});
      if (!state?.skills)
        actions.getSkills();
      isMounted.current = true;
    }
  }, []);

  const getBackgroundLogo = useCallback((skill) => {
    const backgroundLogo = SKILLS.find(skillItem => {
      if (skillItem.TEXT.toLowerCase() === skill.toLowerCase()) {
        return true
      }
      return false
    })
    if (backgroundLogo) return backgroundLogo.LOGO;
    else return "assets/logos/code-default.svg"
  }, [])

  return <>
    {loaders.getSkillsLoader && <FullPageLoader/>}
    <Container>
      <PageHeader>Skills</PageHeader>
      <SkillsWrapper>
        {/*<SkillsRow sm={1} md={2} lg={3}>*/}
        <SkillsRow sm={1} md={2} lg={3} className={"g-3"}>
          {state?.skills?.map(skill =>
            <SkillItem key={skill} sm background={getBackgroundLogo(skill)}>
              {skill}
            </SkillItem>
          )}
        </SkillsRow>
      </SkillsWrapper>
    </Container>
  </>
};

Skills.propTypes = {
  props: PropTypes.object
};
Skills.defaultProps = {
  props: {}
};

export default Skills
