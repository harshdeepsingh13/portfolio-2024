"use client";

import { Container, PageHeader } from "../../app/_globalStyles";
import ProjectCard from "./ProjectCard";
import { ProjectsRow } from "./styles";
const ProjectsComponent = ({ projects }: { projects: any }) => {
  return (
    <>
      <Container>
        <PageHeader>Projects</PageHeader>
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
