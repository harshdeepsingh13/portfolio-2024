"use client";

import { PageLead } from "@/app/_globalStyles";
import Grid2 from "@mui/material/Grid";
import { Container, PageHeader } from "../../app/_globalStyles";
import ProjectCard from "./ProjectCard";
import { ProjectsRow } from "./styles";

const ProjectsComponent = ({ projects }: { projects: any }) => {
  return (
    <>
      <Container>
        <PageHeader>Projects</PageHeader>
        <PageLead>
          Case studies and portfolio projects spanning AI automation, resume tools, marketplaces, photography
          dashboards, and full-stack product builds.
        </PageLead>
        <ProjectsRow spacing={3}>
          {projects?.map((project: any, index: number) => (
            <Grid2 key={project._id} size={{ xs: 12, sm: 6, md: 4 }}>
              <ProjectCard project={project} delay={0.15 + index * 0.07} />
            </Grid2>
          ))}
        </ProjectsRow>
      </Container>
    </>
  );
};

export default ProjectsComponent;
