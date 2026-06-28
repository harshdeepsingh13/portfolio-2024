"use client";

import { Container, PageHeader, Row } from "@/app/_globalStyles";
import BlogCard from "@/components/BlogCard";
import type { BlogPost, BlogPostPreview } from "@/types/blog";
import { faClock, faTag, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import { useScrollMemory } from "@/hooks/useScrollMemory";

function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

interface BlogPostContentProps {
  post: BlogPost;
  relatedPosts: BlogPostPreview[];
  safeHtml: string;
}

const BlogPostContent = ({ post, relatedPosts, safeHtml }: BlogPostContentProps) => {
  const theme = useTheme();
  // Remember the reader's scroll position so a refresh returns them to their
  // spot (load at top, then scroll down) instead of stranding them at the bottom.
  useScrollMemory(post.slug);
  return (
    <Container>
      {post.coverImage && (
        <div
          style={{
            width: "100%",
            // Reserve height before the image loads to avoid layout shift
            // (which is what made native scroll restoration misfire).
            height: "min(420px, 56vw)",
            overflow: "hidden",
            borderRadius: "16px",
            marginBottom: "2rem",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.coverImage}
            alt={post.title}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>
      )}

      <PageHeader component="h1" sx={{ textAlign: "left", fontSize: { xs: "2rem", md: "2.75rem" } }}>
        {post.title}
      </PageHeader>

      {/* Post meta row */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          margin: "1.25rem 0 2rem",
          fontSize: "0.875rem",
          opacity: 0.75,
        }}
      >
        {(post.authorName ?? post.author) && (
          <span>
            <FontAwesomeIcon icon={faUser} style={{ marginRight: "6px" }} />
            {post.authorName ?? "Harshdeep Singh"}
          </span>
        )}
        {post.readingTime != null && (
          <span>
            <FontAwesomeIcon icon={faClock} style={{ marginRight: "6px" }} />
            {post.readingTime} min read
          </span>
        )}
        {post.publishedAt && (
          <span>{formatDate(post.publishedAt)}</span>
        )}
        {post.tags.length > 0 && (
          <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexWrap: "wrap" }}>
            <FontAwesomeIcon icon={faTag} style={{ fontSize: "0.8rem" }} />
            {post.tags.join(", ")}
          </span>
        )}
      </div>

      {/* Post body */}
      {safeHtml && (
        <div
          className="blog-post-body"
          dangerouslySetInnerHTML={{ __html: safeHtml }}
          style={{ lineHeight: 1.85, fontSize: "1.05rem" }}
        />
      )}

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <section style={{ marginTop: "4rem", borderTop: `1px solid ${theme.palette.divider}`, paddingTop: "2rem" }}>
          <h2
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
              fontSize: "1.5rem",
              marginBottom: "1.5rem",
            }}
          >
            Related Posts
          </h2>
          <Row spacing={3} sx={{ alignItems: "stretch" }}>
            {relatedPosts.map((related, index) => (
              <Grid key={related._id} size={{ xs: 12, sm: 6, md: 4 }} sx={{ display: "flex" }}>
                <BlogCard post={related} delay={0.1 + index * 0.07} />
              </Grid>
            ))}
          </Row>
        </section>
      )}
    </Container>
  );
};

export default BlogPostContent;
