"use client";

import { Container, PageHeader, PageLead, Row } from "@/app/_globalStyles";
import BlogCard from "@/components/BlogCard";
import BlogTagFilter from "@/components/BlogTagFilter";
import type { BlogPostPreview } from "@/types/blog";
import Grid from "@mui/material/Grid";

interface BlogListingPageProps {
  posts: BlogPostPreview[];
  allPosts: BlogPostPreview[];
  activeTag: string;
}

const BlogListingPage = ({ posts, allPosts, activeTag }: BlogListingPageProps) => {
  const uniqueTags = Array.from(
    new Set(allPosts.flatMap((post) => post.tags))
  ).sort();

  return (
    <Container>
      <PageHeader>Stdout</PageHeader>
      <PageLead>
        Developer output. Thoughts on full-stack dev, React, TypeScript, Node.js, and AI automation.
      </PageLead>

      {uniqueTags.length > 0 && (
        <BlogTagFilter tags={uniqueTags} activeTag={activeTag} />
      )}

      {posts.length === 0 ? (
        <p
          style={{ textAlign: "center", marginTop: "3rem", opacity: 0.6 }}
          aria-live="polite"
        >
          No posts yet. Check back soon.
        </p>
      ) : (
        <Row spacing={3} sx={{ marginTop: "1.5rem", alignItems: "stretch" }}>
          {posts.map((post, index) => (
            <Grid key={post._id} size={{ xs: 12, sm: 6, md: 4 }} sx={{ display: "flex" }}>
              <BlogCard post={post} delay={0.1 + index * 0.07} />
            </Grid>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default BlogListingPage;
