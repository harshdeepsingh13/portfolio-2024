import educations from "../../modals/educations";
import blogPost from "../../modals/blogPost";
import project from "../../modals/project";
import skill from "../../modals/skill";
import user from "../../modals/user";
import workExperience from "../../modals/workExperience";
import { connectToDB } from "./mongoose";
import type { BlogPost, BlogPostForSitemap, BlogPostPreview } from "@/types/blog";

const userEmail = process.env.UESR_EMAIL;

export const getData = {
  getBasicInformation: async () => {
    // Disable Next.js data cache for this request so DB reads are always fresh.
    // noStore();
    await connectToDB();
    const data = await user
      .findOne(
        { email: userEmail },
        {
          _id: 0,
          name: 1,
          tags: 1,
          objective: 1,
          avatar: 1,
          email: 1,
          contactNumber: 1,
          currentLocation: 1,
          dob: 1,
          website: 1,
          socialMediaLinks: 1,
        },
      )
      .lean();

    return JSON.parse(JSON.stringify(data));
  },
  getSkills: async () => {
    // Disable caching for route-level skill reads.
    // noStore();
    await connectToDB();
    const data = await skill.findOne({ user: userEmail }).lean();
    return JSON.parse(JSON.stringify(data));
  },
  getProjects: async () => {
    // Disable caching so project edits appear immediately.
    // noStore();
    await connectToDB();
    const data = await project.find({ user: userEmail }, undefined, { sort: { startDate: -1 } }).lean();
    return JSON.parse(JSON.stringify(data));
  },
  getWorkExperiences: async () => {
    // Disable caching so experience updates are reflected on first refresh.
    // noStore();
    await connectToDB();
    const data = await workExperience.find({ user: userEmail }, undefined, { sort: { startDate: -1 } }).lean();
    return JSON.parse(JSON.stringify(data));
  },
  getEducationInformation: async () => {
    // Disable caching so education updates are reflected on first refresh.
    // noStore();
    await connectToDB();
    const data = await educations.find({ user: userEmail }, undefined, { sort: { priority: 1 } }).lean();
    return JSON.parse(JSON.stringify(data));
  },
  getPublishedPosts: async (tag?: string): Promise<BlogPostPreview[]> => {
    await connectToDB();
    const filter: Record<string, unknown> = { status: "published" };
    if (tag) filter.tags = tag;
    const data = await blogPost
      .find(filter, {
        title: 1,
        slug: 1,
        author: 1,
        status: 1,
        publishedAt: 1,
        excerpt: 1,
        coverImage: 1,
        tags: 1,
        readingTime: 1,
        createdAt: 1,
        updatedAt: 1,
      })
      .sort({ publishedAt: -1 })
      .lean();
    return JSON.parse(JSON.stringify(data));
  },
  getBlogPostBySlug: async (slug: string): Promise<BlogPost | null> => {
    await connectToDB();
    const data = await blogPost.findOne({ slug, status: "published" }).lean();
    return data ? JSON.parse(JSON.stringify(data)) : null;
  },
  getRelatedPosts: async (slug: string, limit = 3): Promise<BlogPostPreview[]> => {
    await connectToDB();
    const current = await blogPost.findOne({ slug }, { tags: 1 }).lean();
    if (!current) return [];
    const tags = (current as any).tags ?? [];
    const data = await blogPost
      .find(
        { status: "published", slug: { $ne: slug }, tags: { $in: tags } },
        { title: 1, slug: 1, author: 1, publishedAt: 1, excerpt: 1, coverImage: 1, tags: 1, readingTime: 1, createdAt: 1, updatedAt: 1 }
      )
      .sort({ publishedAt: -1 })
      .limit(limit)
      .lean();
    return JSON.parse(JSON.stringify(data));
  },
  getBlogPostsForSitemap: async (): Promise<BlogPostForSitemap[]> => {
    await connectToDB();
    const data = await blogPost
      .find({ status: "published" }, { slug: 1, updatedAt: 1 })
      .lean();
    return JSON.parse(JSON.stringify(data));
  },
  getPortfolioStats: async () => {
    await connectToDB();
    const [projectCount, experiences, allExperiences] = await Promise.all([
      project.countDocuments({ user: userEmail }),
      workExperience.find({ user: userEmail, position: { $not: new RegExp("intern", "i") } }, { startDate: 1 }).lean(),
      workExperience.find({ user: userEmail }, { company: 1 }).lean(),
    ]);
    let yearsExperience = 0;
    if (experiences.length > 0) {
      const earliest = experiences.reduce((min: any, e: any) =>
        new Date(e.startDate) < new Date(min.startDate) ? e : min,
      );
      yearsExperience = (Date.now() - new Date(earliest.startDate).getTime()) / (1000 * 60 * 60 * 24 * 365);
    }
    const clientsServed = new Set((allExperiences as any[]).map((e) => e.company).filter(Boolean)).size;
    return JSON.parse(JSON.stringify({ projectCount, yearsExperience, clientsServed }));
  },
};
