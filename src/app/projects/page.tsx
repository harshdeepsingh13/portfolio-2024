import Breadcrumbs from "@/components/Breadcrumbs";
import ProjectsComponent from "@/components/ProjectsComponent";
import { getData } from "@/lib/getData";
import { Metadata } from "next";

// Keep this route dynamic so project updates appear without redeploying.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Projects | Full-Stack, AI Automation & SaaS Case Studies | Harshdeep Singh",
  description:
    "A showcase of real-world full-stack projects I’ve built — including AI tools, resume builders, marketplaces, and production web apps.",
  // Canonical URL defines the preferred indexable version of this page.
  alternates: {
    canonical: "https://theharshdeepsingh.com/projects",
  },
  openGraph: {
    title: "Projects | Full-Stack, AI Automation & SaaS Case Studies | Harshdeep Singh",
    description: "Dive into the applications and creative solutions I’ve developed as a software engineer.",
    url: "https://theharshdeepsingh.com/projects",
    siteName: "Harshdeep Singh",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects | Full-Stack, AI Automation & SaaS Case Studies | Harshdeep Singh",
    description: "Explore full-stack projects, AI automation tools, resume builders, and production-ready web apps.",
  },
};

const Projects = async () => {
  const projects = await getData.getProjects();

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Projects", href: "/projects" },
        ]}
      />
      <ProjectsComponent projects={projects} />
    </>
  );
};

export default Projects;
