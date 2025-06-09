import ProjectsComponent from "@/components/ProjectsComponent";
import { getData } from "@/lib/getData";

const Projects = async () => {
  const projects = await getData.getProjects();

  return (
    <>
      <ProjectsComponent projects={projects} />
    </>
  );
};

export default Projects;
