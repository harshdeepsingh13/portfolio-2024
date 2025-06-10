import ProjectsComponent from "@/components/ProjectsComponent";
import { getData } from "@/lib/getData";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | Harshdeep Singh",
  description: "A showcase of real-world full-stack projects I’ve built — including AI tools, resume builders, and more.",
  openGraph: {
    title: "Projects | Harshdeep Singh",
    description: "Dive into the applications and creative solutions I’ve developed as a software engineer.",
    url: "https://theharshdeepsingh.com/projects",
    siteName: "Harshdeep Singh",
    locale: "en_US",
    type: "website",
  },
};

const Projects = async () => {
  const projects = await getData.getProjects();

  return (
    <>
      <ProjectsComponent projects={projects} />
    </>
  );
};

export default Projects;
