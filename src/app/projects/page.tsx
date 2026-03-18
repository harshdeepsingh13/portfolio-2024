import ProjectsComponent from "@/components/ProjectsComponent";
import { getData } from "@/lib/getData";
import { Metadata } from "next";

// Keep this route dynamic so project updates appear without redeploying.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Projects | Harshdeep Singh",
  description: "A showcase of real-world full-stack projects I’ve built — including AI tools, resume builders, and more.",
  // Canonical URL defines the preferred indexable version of this page.
  alternates: {
    canonical: "https://theharshdeepsingh.com/projects",
  },
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
