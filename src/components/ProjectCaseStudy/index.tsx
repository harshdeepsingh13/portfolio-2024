"use client";

import { Container, PageHeader } from "@/app/_globalStyles";
import { CardLink, CardLinksContainer } from "@/components/Card/styles";
import { TechItem } from "@/components/ProjectsComponent/styles";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faCalendar, faGlobe } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTheme } from "@mui/material/styles";

interface ProjectCaseStudyProps {
  project: {
    name?: string;
    summary?: string;
    technologyStack?: string[];
    link?: string;
    website?: string;
    startDate?: string;
    endDate?: string;
    isPresent?: boolean;
  };
  safeHtml: string;
}

function formatMonthYear(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function formatRange(start?: string, end?: string, isPresent?: boolean): string {
  if (!start) return "";
  const startLabel = formatMonthYear(start);
  const endLabel = isPresent ? "Present" : end ? formatMonthYear(end) : "";
  return endLabel ? `${startLabel} – ${endLabel}` : startLabel;
}

const ProjectCaseStudy = ({ project, safeHtml }: ProjectCaseStudyProps) => {
  const theme = useTheme();
  const dateRange = formatRange(project.startDate, project.endDate, project.isPresent);

  return (
    <Container>
      <PageHeader component="h1" sx={{ textAlign: "left", fontSize: { xs: "2rem", md: "2.75rem" } }}>
        {project.name}
      </PageHeader>

      {/* Meta row: dates + repo/live links */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "1rem",
          margin: "1.25rem 0 1.75rem",
          fontSize: "0.875rem",
          opacity: 0.85,
        }}
      >
        {dateRange && (
          <span>
            <FontAwesomeIcon icon={faCalendar} style={{ marginRight: "6px" }} />
            {dateRange}
          </span>
        )}
        {(project.link || project.website) && (
          <CardLinksContainer>
            {project.link && (
              <CardLink href={project.link} target="_blank" rel="noreferrer noopener" aria-label="GitHub repository">
                <FontAwesomeIcon icon={faGithub} />
              </CardLink>
            )}
            {project.website && (
              <CardLink href={project.website} target="_blank" rel="noreferrer noopener" aria-label="Live website">
                <FontAwesomeIcon icon={faGlobe} />
              </CardLink>
            )}
          </CardLinksContainer>
        )}
      </div>

      {/* Original framing intro (sits above the README) */}
      {project.summary && (
        <div
          dangerouslySetInnerHTML={{ __html: project.summary }}
          style={{
            fontSize: "1.15rem",
            lineHeight: 1.7,
            color: theme.palette.text.secondary,
            fontWeight: 300,
            margin: "0 0 1.5rem",
          }}
        />
      )}

      {/* Tech stack chips */}
      {project.technologyStack && project.technologyStack.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.75rem",
            margin: "0 0 2.25rem",
            paddingBottom: "1.5rem",
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          {project.technologyStack.map((tech) => (
            <TechItem key={tech}>{tech}</TechItem>
          ))}
        </div>
      )}

      {/* README body (sanitized) — reuses the blog prose styling */}
      {safeHtml && (
        <div
          className="blog-post-body"
          dangerouslySetInnerHTML={{ __html: safeHtml }}
          style={{ lineHeight: 1.85, fontSize: "1.05rem" }}
        />
      )}
    </Container>
  );
};

export default ProjectCaseStudy;
