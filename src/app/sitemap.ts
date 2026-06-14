import type { MetadataRoute } from "next";
import { getData } from "@/lib/getData";

export const dynamic = "force-dynamic";

const siteUrl = "https://theharshdeepsingh.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/skills`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/projects`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/experiences`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/education`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/resume`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  let blogPostEntries: MetadataRoute.Sitemap = [];
  try {
    const blogPosts = await getData.getBlogPostsForSitemap();
    blogPostEntries = blogPosts
      .filter((post) => post.updatedAt && !isNaN(new Date(post.updatedAt).getTime()))
      .map((post) => ({
        url: `${siteUrl}/blog/${post.slug}`,
        lastModified: new Date(post.updatedAt),
        changeFrequency: "monthly" as const,
        priority: 0.8,
      }));
  } catch (err) {
    console.error("[sitemap] Failed to fetch blog posts:", err);
  }

  let projectEntries: MetadataRoute.Sitemap = [];
  try {
    const caseStudies = await getData.getProjectCaseStudyIndex();
    projectEntries = caseStudies
      .filter((p) => p.hasCaseStudy)
      .map((p) => {
        // README can change without the DB doc being re-saved — use the freshest signal.
        const stamps = [p.updatedAt, p.readmeLastModified]
          .filter((d): d is string => Boolean(d))
          .map((d) => new Date(d).getTime())
          .filter((t) => !isNaN(t));
        return {
          url: `${siteUrl}/projects/${p.slug}`,
          lastModified: stamps.length ? new Date(Math.max(...stamps)) : now,
          changeFrequency: "monthly" as const,
          priority: 0.8, // matches blog posts; these are primary SEO targets
        };
      });
  } catch (err) {
    console.error("[sitemap] Failed to fetch project case studies:", err);
  }

  return [...staticEntries, ...blogPostEntries, ...projectEntries];
}
