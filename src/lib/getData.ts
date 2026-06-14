import educations from "../../modals/educations";
import { blogPostSchema } from "../../modals/blogPost";
import { blogUserSchema } from "../../modals/blogUser";
import project from "../../modals/project";
import skill from "../../modals/skill";
import user from "../../modals/user";
import workExperience from "../../modals/workExperience";
import { connectToDB, connectToBlogsDB } from "./mongoose";
import type { BlogPost, BlogPostForSitemap, BlogPostPreview } from "@/types/blog";
import { unstable_cache } from "next/cache";
import slugify from "slugify";
import { fetchReadmeHtml, parseRepo, README_MIN_CHARS } from "./github";

const userEmail = process.env.UESR_EMAIL;

// Minimum raw `summary` length for a project to earn a case-study page.
// The summary is the original intro that sits above the (GitHub-duplicated)
// README — this is the original-text-ratio gate, not just README bulk.
const SUMMARY_MIN_CHARS = 150;

/** Derive a project's URL slug from its name — same slugify config the blog uses. */
export const slugifyProjectName = (name?: string): string =>
  name ? slugify(name, { lower: true, strict: true }) : "";

export interface ProjectDetail {
  _id?: string;
  name?: string;
  summary?: string;
  tagLine?: string;
  technologyStack?: string[];
  link?: string;
  website?: string;
  startDate?: string;
  endDate?: string;
  isPresent?: boolean;
  updatedAt?: string;
  slug: string;
}

export interface ProjectCaseStudyEntry {
  slug: string;
  name: string;
  updatedAt: string | null;
  readmeLastModified: string | null;
  hasCaseStudy: boolean;
}

// Build the case-study eligibility index: for every project with a parseable
// GitHub link, fetch its README (in parallel) and decide whether it qualifies
// for a dedicated page. Wrapped in unstable_cache so the GitHub calls are cached
// for an hour regardless of the calling route's `dynamic` setting (sitemap.ts is
// force-dynamic and would otherwise re-fetch every README on each crawl).
const buildProjectCaseStudyIndex = unstable_cache(
  async (): Promise<ProjectCaseStudyEntry[]> => {
    await connectToDB();
    const docs = await project
      .find({ user: userEmail }, undefined, { sort: { startDate: -1 } })
      .lean();
    const list = JSON.parse(JSON.stringify(docs)) as Array<{
      name?: string;
      summary?: string;
      link?: string;
      updatedAt?: string;
    }>;

    const entries = await Promise.all(
      list.map(async (p) => {
        if (!parseRepo(p.link)) return null;
        const summaryLen = typeof p.summary === "string" ? p.summary.length : 0;
        const readme = await fetchReadmeHtml(p.link).catch(() => null);
        const textLength = readme?.textLength ?? 0;
        return {
          slug: slugifyProjectName(p.name),
          name: p.name ?? "",
          updatedAt: p.updatedAt ?? null,
          readmeLastModified: readme?.readmeLastModified ?? null,
          hasCaseStudy: textLength >= README_MIN_CHARS && summaryLen >= SUMMARY_MIN_CHARS,
        } satisfies ProjectCaseStudyEntry;
      }),
    );

    return entries.filter((e): e is ProjectCaseStudyEntry => e !== null);
  },
  ["project-case-study-index-v1"],
  { revalidate: 3600 },
);

const attachAuthorNames = async (
  conn: Awaited<ReturnType<typeof connectToBlogsDB>>,
  posts: BlogPostPreview[],
): Promise<BlogPostPreview[]> => {
  const authorIds = Array.from(
    new Set(
      posts
        .map((post) => post.author)
        .filter((author): author is string => typeof author === "string" && author.length > 0),
    ),
  );

  if (authorIds.length === 0) {
    return posts;
  }

  try {
    const BlogUser = conn.models.blogUser || conn.model("blogUser", blogUserSchema);
    const authorDocs = await BlogUser
      .find({ _id: { $in: authorIds } })
      .select("_id name")
      .lean() as Array<{ _id: unknown; name?: string }>;

    const authorNameById = new Map<string, string>();
    for (const authorDoc of authorDocs) {
      if (authorDoc.name) {
        authorNameById.set(String(authorDoc._id), authorDoc.name);
      }
    }

    return posts.map((post) => ({
      ...post,
      authorName: post.author ? authorNameById.get(String(post.author)) : post.authorName,
    }));
  } catch {
    return posts;
  }
};

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
  // Resolve a project by its derived slug. Slugs aren't stored, so we slugify
  // each project's name and match — O(projects), fine at this scale.
  getProjectBySlug: async (slug: string): Promise<ProjectDetail | null> => {
    await connectToDB();
    const data = await project
      .find({ user: userEmail }, undefined, { sort: { startDate: -1 } })
      .lean();
    const list = JSON.parse(JSON.stringify(data)) as ProjectDetail[];
    const match = list.find((p) => p.name && slugifyProjectName(p.name) === slug);
    return match ? { ...match, slug } : null;
  },
  // Case-study eligibility index, shared by the listing and the sitemap.
  // Degrades gracefully (empty array) if GitHub is unreachable.
  getProjectCaseStudyIndex: async (): Promise<ProjectCaseStudyEntry[]> => {
    try {
      return await buildProjectCaseStudyIndex();
    } catch {
      return [];
    }
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
    return attachAuthorNames(conn, posts);
  },
  getBlogPostBySlug: async (slug: string): Promise<BlogPost | null> => {
    const conn = await connectToBlogsDB();
    const BlogPost = conn.models.blogPost || conn.model("blogPost", blogPostSchema);
    const data = await BlogPost.findOne({ slug, status: "published" }).lean();
    if (!data) return null;
    const post: BlogPost = JSON.parse(JSON.stringify(data));
    if (post.author) {
      try {
        const BlogUser = conn.models.blogUser || conn.model("blogUser", blogUserSchema);
        const authorDoc = await BlogUser.findById(post.author).select("name").lean() as { name?: string } | null;
        if (authorDoc?.name) post.authorName = authorDoc.name;
      } catch { /* author lookup failed */ }
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
        const BlogUser = conn.models.blogUser || conn.model("blogUser", blogUserSchema);
        const authorDoc = await BlogUser.findById(post.author).select("name").lean() as { name?: string } | null;
        if (authorDoc?.name) post.authorName = authorDoc.name;
      } catch { /* author lookup failed */ }
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
    return attachAuthorNames(conn, posts);
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
