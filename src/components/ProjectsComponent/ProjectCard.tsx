import { CardTitle } from "@/app/_globalStyles";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import ColorThief from "colorthief/dist/color-thief.mjs";
import { CardLink, CardLinksContainer } from "../Card/styles";
import { CaseStudyLink, ProjectItem, ProjectLogo, TechItem } from "./styles";

const LOGO_MAP: Record<string, { link: string; width?: number; height?: number }> = {
  "Unconventional Music Player": { link: "/assets/logos/unconventional-player.svg" },
  //   "Unconventional Music Player": "/assets/logos/ts.png",
  "Career Canvas": { link: "/assets/logos/career-canvas.svg" },
  Pixeliano: { link: "/assets/logos/pixeliano.png" },
  "Pixeliano Admin App": { link: "/assets/logos/pixeliano.png" },
  "StockFlow AI": { link: "/assets/logos/stockflowAI.png" },
  "Portfolio & Publishing Platform": { link: "/assets/logos/portfolio.svg", width: 48, height: 48 },
};

const ProjectCard = ({
  project,
  delay,
  caseStudy,
}: {
  project: any;
  delay?: number;
  caseStudy?: { slug: string; hasCaseStudy: boolean };
}) => {
  return (
    <ProjectItem key={project._id} delay={delay}>
      <div>
        <ProjectLogo
          src={LOGO_MAP[project.name].link}
          alt={`${project.name} Logo`}
          width={LOGO_MAP[project.name]?.width || 60}
          height={LOGO_MAP[project.name]?.height || 60}
        />
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

        {caseStudy?.hasCaseStudy && (
          <CaseStudyLink href={`/projects/${caseStudy.slug}`}>
            View case study <span aria-hidden="true">→</span>
          </CaseStudyLink>
        )}
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
