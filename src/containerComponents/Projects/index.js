import React, {useCallback, useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {Container, PageHeader} from "../../GlobalStyles";
import {ProjectItem, ProjectLogo, ProjectName, ProjectsRow, ProjectsWrapper, TechItem} from "./styles";
import {useUserDetailsContext} from "../../context/UserDetailsContext";
import FullPageLoader from "../../components/FullPageLoader";
import ColorThief from "colorthief/dist/color-thief.mjs";
import {faGithub} from "@fortawesome/free-brands-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {CardLink, CardLinksContainer} from "../../components/Card/styles";
import {faGlobe} from "@fortawesome/free-solid-svg-icons";

const colorThief = new ColorThief();

const LOGO_MAP = {
	"Unconventional Music Player": "assets/logos/unconventional-player.svg",
	"Pixeliano": "assets/logos/pixeliano.png",
	"Pixeliano Admin App": "assets/logos/pixeliano.png",
}

const Projects = props => {

	const {state, actions, loaders} = useUserDetailsContext();

	let isMounted = useRef(false);

	useEffect(() => {
		if (!isMounted.current) {
			if (!state?.projects) {
				actions.getProjects();
			}
			isMounted.current = true;
		}
	}, []);


	return <>
		{loaders.getProjectsLoader && <FullPageLoader/>}
		<Container>
			<PageHeader>Projects</PageHeader>
			<ProjectsWrapper>
				<ProjectsRow sm={1} md={2} lg={3} className={"gx-2 gy-3"}>
					{state?.projects?.map(project =>
						<ProjectCard project={project} key={project._id}/>
					)}
				</ProjectsRow>
			</ProjectsWrapper>
		</Container>
	</>
};

const ProjectCard = ({project}) => {

	const [accentColor, setAccentColor] = useState("rgba(0,0,0, 0.15)")

	const getDominantColor = useCallback(({target}) => {
		const [r, g, b] = colorThief.getColor(target);
		setAccentColor(`rgba(${r}, ${g}, ${b}, 0.15)`);
	}, []);

	return <ProjectItem key={project._id} accentColor={accentColor}>
		<div>
			<ProjectLogo
				src={LOGO_MAP[project.name]}
				alt={`${project.name} Logo`}
				onLoad={getDominantColor}
			/>
			<div className="name-container">
				<ProjectName>{project.name}</ProjectName>
				<CardLinksContainer>
					{project.link &&
						<CardLink href={project.link} target={"_blank"} rel={"noreferrer noopener"} dataHelp={"GitHub"}>
							<FontAwesomeIcon icon={faGithub}/>
						</CardLink>
					}
					{project.website &&
						<CardLink href={project.website} target={"_blank"} rel={"noreferrer noopener"}>
							<FontAwesomeIcon icon={faGlobe}/>
						</CardLink>
					}
				</CardLinksContainer>
			</div>

			{project.tagLine && <div className="tag-line-container">
				{project.tagLine}
			</div>
			}

			{project.summary &&
				<div className="summary-container" dangerouslySetInnerHTML={{__html: project.summary}}/>
			}
		</div>

		{project?.technologyStack &&
			<div className="technology-stack-container">
				{project?.technologyStack.map(tech =>
					<TechItem key={tech}>
						{tech}
					</TechItem>
				)}
			</div>
		}
	</ProjectItem>
}

Projects.propTypes = {
	props: PropTypes.object
};
Projects.defaultProps = {
	props: {}
};

export default Projects
