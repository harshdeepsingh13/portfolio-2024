import Breadcrumbs from "@/components/Breadcrumbs";
import ProjectCaseStudy from "@/components/ProjectCaseStudy";
import { getData, type ProjectDetail } from "@/lib/getData";
import { fetchReadmeHtml, README_MIN_CHARS } from "@/lib/github";
import { safeJsonLd } from "@/lib/jsonLd";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const revalidate = 3600;

const SITE_URL = "https://theharshdeepsingh.com";
const SUMMARY_MIN_CHARS = 150;

function stripHtml(value?: string): string {
  return (value ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function metaDescription(project: ProjectDetail): string {
  const summary = stripHtml(project.summary);
  if (summary) return summary.length > 160 ? `${summary.slice(0, 157)}…` : summary;
  const tech = project.technologyStack?.join(", ");
  return tech ? `A ${tech} project by Harshdeep Singh.` : "A project by Harshdeep Singh.";
}

/**
 * Resolve a project AND verify it qualifies for a case-study page (substantial
 * README + original intro). Returns null when missing or gated. Shared by
 * generateMetadata and the page so the noindex/404 decision is consistent.
 * The README fetch is cached (revalidate 3600), so calling this twice per
 * request costs one GitHub round-trip.
 */
async function loadEligibleProject(
  slug: string,
): Promise<{ project: ProjectDetail; html: string } | null> {
  const project = await getData.getProjectBySlug(slug);
  if (!project) return null;
  if ((project.summary?.length ?? 0) < SUMMARY_MIN_CHARS) return null;
  const readme = await fetchReadmeHtml(project.link);
  if (!readme || readme.textLength < README_MIN_CHARS) return null;
  return { project, html: readme.html };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const eligible = await loadEligibleProject(slug);
  // Missing or gated → soft-404 page; mark noindex so it can never be indexed
  // (notFound() renders a 200 in this app due to global middleware).
  if (!eligible) {
    return { title: "Project not found", robots: { index: false, follow: false } };
  }
  const { project } = eligible;

  const url = `${SITE_URL}/projects/${slug}`;
  const title = `${project.name} | Harshdeep Singh`;
  const description = metaDescription(project);

  return {
    title,
    description,
    // Canonical for hygiene only — does not de-duplicate against github.com.
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "Harshdeep Singh",
      locale: "en_US",
      type: "article",
      ...(project.startDate && { publishedTime: project.startDate }),
      ...(project.updatedAt && { modifiedTime: project.updatedAt }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

const ProjectDetailPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const eligible = await loadEligibleProject(slug);
  if (!eligible) notFound();
  const { project, html } = eligible;

  const url = `${SITE_URL}/projects/${slug}`;
  const description = metaDescription(project);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: project.name,
    description,
    ...(project.startDate && { datePublished: project.startDate }),
    ...(project.updatedAt && { dateModified: project.updatedAt }),
    inLanguage: "en-US",
    author: { "@id": `${SITE_URL}/#person` },
    publisher: { "@id": `${SITE_URL}/#person` },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    ...(project.technologyStack?.length && {
      keywords: project.technologyStack.join(", "),
    }),
    about: {
      "@type": "SoftwareSourceCode",
      name: project.name,
      ...(project.link && { codeRepository: project.link }),
      ...(project.technologyStack?.length && {
        programmingLanguage: project.technologyStack,
      }),
      ...(project.website && { url: project.website }),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }}
      />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Projects", href: "/projects" },
          { label: project.name ?? "Project", href: `/projects/${slug}` },
        ]}
      />
      <ProjectCaseStudy project={project} safeHtml={html} />
    </>
  );
};

export default ProjectDetailPage;
