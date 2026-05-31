import type { MetadataRoute } from "next";
import { getData } from "@/lib/getData";

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
  ];

  let blogEntries: MetadataRoute.Sitemap = [];
  try {
    const blogPosts = await getData.getBlogPostsForSitemap();
    blogEntries = [
      {
        url: `${siteUrl}/blog`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8,
      },
      ...blogPosts
        .filter((post) => post.updatedAt && !isNaN(new Date(post.updatedAt).getTime()))
        .map((post) => ({
          url: `${siteUrl}/blog/${post.slug}`,
          lastModified: new Date(post.updatedAt),
          changeFrequency: "monthly" as const,
          priority: 0.8,
        })),
    ];
  } catch (err) {
    console.error("[sitemap] Failed to fetch blog posts:", err);
  }

  return [...staticEntries, ...blogEntries];
}
