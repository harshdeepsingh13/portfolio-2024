import Breadcrumbs from "@/components/Breadcrumbs";
import BlogListingPage from "@/components/BlogListingPage";
import { getData } from "@/lib/getData";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Blog — Harshdeep Singh",
  description:
    "Articles on full stack development, React, TypeScript, Node.js, and AI automation by Harshdeep Singh.",
  alternates: {
    canonical: "https://theharshdeepsingh.com/blog",
    types: {
      "application/rss+xml": [
        { url: "https://theharshdeepsingh.com/blog/rss.xml", title: "Harshdeep Singh Blog" },
      ],
    },
  },
  openGraph: {
    title: "Blog — Harshdeep Singh",
    description:
      "Articles on full stack development, React, TypeScript, Node.js, and AI automation by Harshdeep Singh.",
    url: "https://theharshdeepsingh.com/blog",
    siteName: "Harshdeep Singh",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/assets/og/default.png",
        width: 1200,
        height: 630,
        alt: "Harshdeep Singh Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog — Harshdeep Singh",
    description:
      "Articles on full stack development, React, TypeScript, Node.js, and AI automation by Harshdeep Singh.",
    images: ["/assets/og/default.png"],
  },
};

const BlogPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) => {
  const params = await searchParams;
  const activeTag = params.tag ?? "all";

  const [allPosts, filteredPosts] = await Promise.all([
    getData.getPublishedPosts(),
    activeTag !== "all" ? getData.getPublishedPosts(activeTag) : Promise.resolve([]),
  ]);

  const posts = activeTag !== "all" ? filteredPosts : allPosts;

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Stdout", href: "/blog" },
        ]}
      />
      <BlogListingPage posts={posts} allPosts={allPosts} activeTag={activeTag} />
    </>
  );
};

export default BlogPage;
