import Breadcrumbs from "@/components/Breadcrumbs";
import ProjectsComponent from "@/components/ProjectsComponent";
import { getData } from "@/lib/getData";
import { Metadata } from "next";

export const revalidate = 3600;

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
    images: [
      {
        url: "/assets/og/default.png",
        width: 1200,
        height: 630,
        alt: "Harshdeep Singh – Full Stack Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects | Full-Stack, AI Automation & SaaS Case Studies | Harshdeep Singh",
    description: "Explore full-stack projects, AI automation tools, resume builders, and production-ready web apps.",
    images: ["/assets/og/default.png"],
  },
};

const siteUrl = "https://theharshdeepsingh.com";

const Projects = async () => {
  const [projects, caseStudyIndex] = await Promise.all([
    getData.getProjects(),
    getData.getProjectCaseStudyIndex(),
  ]);

  // Map project name → { slug, hasCaseStudy } so cards can link eligible ones.
  const caseStudyMap: Record<string, { slug: string; hasCaseStudy: boolean }> =
    Object.fromEntries(
      caseStudyIndex.map((entry) => [
        entry.name,
        { slug: entry.slug, hasCaseStudy: entry.hasCaseStudy },
      ]),
    );

  const projectsItemListJsonLd = projects?.length
    ? {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Portfolio Projects by Harshdeep Singh",
        description:
          "A showcase of full-stack, AI automation, SaaS, and production web applications.",
        url: `${siteUrl}/projects`,
        numberOfItems: projects.length,
        itemListElement: projects.map((project: any, index: number) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": project.website ? "SoftwareApplication" : "CreativeWork",
            name: project.name,
            ...(project.summary && { description: project.summary }),
            ...(project.website && { url: project.website }),
            ...(project.link && { codeRepository: project.link }),
            ...(project.technologyStack?.length && {
              keywords: project.technologyStack.join(", "),
            }),
            author: { "@id": `${siteUrl}/#person` },
            ...(project.website && {
              applicationCategory: "WebApplication",
              operatingSystem: "Web Browser",
            }),
          },
        })),
      }
    : null;

  return (
    <>
      {projectsItemListJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(projectsItemListJsonLd) }}
        />
      )}
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Projects", href: "/projects" },
        ]}
      />
      <ProjectsComponent projects={projects} caseStudyMap={caseStudyMap} />
    </>
  );
};

export default Projects;
