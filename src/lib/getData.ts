import educations from "../../modals/educations";
import { blogPostSchema } from "../../modals/blogPost";
import project from "../../modals/project";
import skill from "../../modals/skill";
import user from "../../modals/user";
import workExperience from "../../modals/workExperience";
import { connectToDB, connectToBlogsDB } from "./mongoose";
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
    const conn = await connectToBlogsDB();
    const BlogPost = conn.models.blogPost || conn.model("blogPost", blogPostSchema);
    const filter: Record<string, unknown> = { status: "published" };
    if (tag) filter.tags = tag;
    const data = await BlogPost
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
    const posts: BlogPostPreview[] = JSON.parse(JSON.stringify(data));
    if (posts.length > 0 && posts[0].author) {
      try {
        await connectToDB();
        const authorDoc = await user.findById(posts[0].author).select("name").lean() as { name?: string } | null;
        if (authorDoc?.name) {
          const authorName = authorDoc.name;
          return posts.map((p) => ({ ...p, authorName }));
        }
      } catch { /* author not yet an ObjectId — migration pending */ }
    }
    return posts;
  },
  getBlogPostBySlug: async (slug: string): Promise<BlogPost | null> => {
    const conn = await connectToBlogsDB();
    const BlogPost = conn.models.blogPost || conn.model("blogPost", blogPostSchema);
    const data = await BlogPost.findOne({ slug, status: "published" }).lean();
    if (!data) return null;
    const post: BlogPost = JSON.parse(JSON.stringify(data));
    if (post.author) {
      try {
        await connectToDB();
        const authorDoc = await user.findById(post.author).select("name").lean() as { name?: string } | null;
        if (authorDoc?.name) post.authorName = authorDoc.name;
      } catch { /* author not yet an ObjectId — migration pending */ }
    }
    return post;
  },
  getBlogPostBySlugForPreview: async (slug: string): Promise<BlogPost | null> => {
    const conn = await connectToBlogsDB();
    const BlogPost = conn.models.blogPost || conn.model("blogPost", blogPostSchema);
    const data = await BlogPost.findOne({ slug }).lean() as (BlogPost & { draft?: Partial<BlogPost> }) | null;
    if (!data) return null;
    // Merge draft over root so preview shows the last-saved (unpublished) content
    const merged = data.hasDraft && data.draft
      ? { ...data, ...data.draft }
      : data;
    const post: BlogPost = JSON.parse(JSON.stringify(merged));
    if (post.author) {
      try {
        await connectToDB();
        const authorDoc = await user.findById(post.author).select("name").lean() as { name?: string } | null;
        if (authorDoc?.name) post.authorName = authorDoc.name;
      } catch { /* author not yet an ObjectId — migration pending */ }
    }
    return post;
  },
  getRelatedPosts: async (slug: string, limit = 3): Promise<BlogPostPreview[]> => {
    const conn = await connectToBlogsDB();
    const BlogPost = conn.models.blogPost || conn.model("blogPost", blogPostSchema);
    const current = await BlogPost.findOne({ slug }, { tags: 1 }).lean();
    if (!current) return [];
    const tags = (current as any).tags ?? [];
    const data = await BlogPost
      .find(
        { status: "published", slug: { $ne: slug }, tags: { $in: tags } },
        { title: 1, slug: 1, author: 1, publishedAt: 1, excerpt: 1, coverImage: 1, tags: 1, readingTime: 1, createdAt: 1, updatedAt: 1 }
      )
      .sort({ publishedAt: -1 })
      .limit(limit)
      .lean();
    const posts: BlogPostPreview[] = JSON.parse(JSON.stringify(data));
    if (posts.length > 0 && posts[0].author) {
      try {
        await connectToDB();
        const authorDoc = await user.findById(posts[0].author).select("name").lean() as { name?: string } | null;
        if (authorDoc?.name) {
          const authorName = authorDoc.name;
          return posts.map((p) => ({ ...p, authorName }));
        }
      } catch { /* author not yet an ObjectId — migration pending */ }
    }
    return posts;
  },
  getBlogPostsForSitemap: async (): Promise<BlogPostForSitemap[]> => {
    const conn = await connectToBlogsDB();
    const BlogPost = conn.models.blogPost || conn.model("blogPost", blogPostSchema);
    const data = await BlogPost
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
