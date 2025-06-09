import { CardTitle } from "@/app/_globalStyles";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import ColorThief from "colorthief/dist/color-thief.mjs";
import { CardLink, CardLinksContainer } from "../Card/styles";
import { ProjectItem, ProjectLogo, TechItem } from "./styles";

const LOGO_MAP: Record<string, string> = {
  "Unconventional Music Player": "/assets/logos/unconventional-player.svg",
  //   "Unconventional Music Player": "/assets/logos/ts.png",
  "Career Canvas": "/assets/logos/career-canvas.svg",
  Pixeliano: "/assets/logos/pixeliano.png",
  "Pixeliano Admin App": "/assets/logos/pixeliano.png",
};

const ProjectCard = ({ project }: { project: any }) => {

  return (
    <ProjectItem key={project._id}>
      <div>
        <ProjectLogo src={LOGO_MAP[project.name]} alt={`${project.name} Logo`} width={60} height={60} />
        <div className="name-container">
          <CardTitle>{project.name}</CardTitle>
          <CardLinksContainer>
            {project.link && (
              <CardLink href={project.link} target={"_blank"} rel={"noreferrer noopener"}>
                <FontAwesomeIcon icon={faGithub} />
              </CardLink>
            )}
            {project.website && (
              <CardLink href={project.website} target={"_blank"} rel={"noreferrer noopener"}>
                <FontAwesomeIcon icon={faGlobe} />
              </CardLink>
            )}
          </CardLinksContainer>
        </div>

        {project.tagLine && <div className="tag-line-container">{project.tagLine}</div>}

        {project.summary && <div className="summary-container" dangerouslySetInnerHTML={{ __html: project.summary }} />}
      </div>

      {project?.technologyStack && (
        <div className="technology-stack-container">
          {project?.technologyStack.map((tech: string) => (
            <TechItem key={tech}>{tech}</TechItem>
          ))}
        </div>
      )}
    </ProjectItem>
  );
};

export default ProjectCard;
