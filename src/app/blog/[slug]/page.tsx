import Breadcrumbs from "@/components/Breadcrumbs";
import BlogPostContent from "@/components/BlogPostContent";
import PreviewBanner from "@/components/PreviewBanner";
import { getData } from "@/lib/getData";
import { safeJsonLd } from "@/lib/jsonLd";
import { sanitizeHtml } from "@/lib/sanitize";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

const SITE_URL = "https://theharshdeepsingh.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getData.getBlogPostBySlug(slug);
  if (!post) return {};

  const ogImage = post.seo?.ogImage ?? post.coverImage;

  return {
    title: post.seo?.metaTitle ?? post.title,
    description: post.seo?.metaDescription ?? post.excerpt,
    alternates: { canonical: `${SITE_URL}/blog/${post.slug}` },
    openGraph: {
      title: post.seo?.metaTitle ?? post.title,
      description: post.seo?.metaDescription ?? post.excerpt,
      images: ogImage ? [{ url: ogImage }] : undefined,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      url: `${SITE_URL}/blog/${post.slug}`,
      siteName: "Harshdeep Singh",
    },
    twitter: {
      card: "summary_large_image",
      title: post.seo?.metaTitle ?? post.title,
      description: post.seo?.metaDescription ?? post.excerpt,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

const BlogPostPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}) => {
  const { slug } = await params;
  const sp = await searchParams;
  const isPreview = sp.preview === "1";

  if (isPreview) {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/admin/login");

    const post = await getData.getBlogPostBySlugForPreview(slug);
    if (!post) notFound();

    const safeHtml = post.body_html ? await sanitizeHtml(post.body_html) : "";

    return (
      <>
        <PreviewBanner postId={String((post as { _id?: unknown })._id)} slug={slug} />
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Stdout", href: "/blog" },
            { label: post.title, href: `/blog/${post.slug}` },
          ]}
        />
        <BlogPostContent post={post} relatedPosts={[]} safeHtml={safeHtml} />
      </>
    );
  }

  const [post, relatedPosts] = await Promise.all([
    getData.getBlogPostBySlug(slug),
    getData.getRelatedPosts(slug, 3),
  ]);

  if (!post) notFound();

  const safeHtml = post.body_html ? await sanitizeHtml(post.body_html) : "";

  const ogImage = post.seo?.ogImage ?? post.coverImage;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: ogImage,
    author: { "@id": `${SITE_URL}/#person` },
    publisher: { "@id": `${SITE_URL}/#person` },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${post.slug}`,
    },
    keywords: post.tags,
    inLanguage: "en-US",
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
          { label: "Stdout", href: "/blog" },
          { label: post.title, href: `/blog/${post.slug}` },
        ]}
      />
      <BlogPostContent post={post} relatedPosts={relatedPosts} safeHtml={safeHtml} />
    </>
  );
};

export default BlogPostPage;
