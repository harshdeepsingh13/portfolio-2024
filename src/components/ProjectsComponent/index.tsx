"use client";

import { PageLead } from "@/app/_globalStyles";
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
        <ProjectsRow sm={1} md={2} lg={3} className={"gx-2 gy-3"}>
          {projects?.map((project: any) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </ProjectsRow>
      </Container>
    </>
  );
};

export default ProjectsComponent;
