import type { BlogPostPreview } from "@/types/blog";
import { faClock, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import {
  BlogCardContent,
  BlogCardExcerpt,
  BlogCardImage,
  BlogCardMeta,
  BlogCardMetaDot,
  BlogCardTag,
  BlogCardTagsRow,
  BlogCardTitle,
  BlogCardWrapper,
} from "./styles";

function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const BlogCard = ({ post, delay }: { post: BlogPostPreview; delay?: number }) => {
  return (
    <Link href={`/blog/${post.slug}`} style={{ display: "block", height: "100%", textDecoration: "none", color: "inherit" }}>
      <BlogCardWrapper delay={delay}>
        {post.coverImage && (
          <BlogCardImage>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.coverImage} alt={post.title} loading="lazy" />
          </BlogCardImage>
        )}
        <BlogCardContent>
          <BlogCardTitle>{post.title}</BlogCardTitle>
          {post.excerpt && <BlogCardExcerpt>{post.excerpt}</BlogCardExcerpt>}
          {post.tags.length > 0 && (
            <BlogCardTagsRow>
              {post.tags.slice(0, 4).map((tag) => (
                <BlogCardTag key={tag}>{tag}</BlogCardTag>
              ))}
            </BlogCardTagsRow>
          )}
          <BlogCardMeta>
            {post.author && (
              <>
                <span>
                  <FontAwesomeIcon icon={faUser} style={{ marginRight: "4px", fontSize: "0.7rem" }} />
                  {post.author}
                </span>
                <BlogCardMetaDot aria-hidden="true">·</BlogCardMetaDot>
              </>
            )}
            {post.readingTime != null && (
              <>
                <span>
                  <FontAwesomeIcon icon={faClock} style={{ marginRight: "4px", fontSize: "0.7rem" }} />
                  {post.readingTime} min read
                </span>
                <BlogCardMetaDot aria-hidden="true">·</BlogCardMetaDot>
              </>
            )}
            <span>{formatDate(post.publishedAt ?? post.createdAt)}</span>
          </BlogCardMeta>
        </BlogCardContent>
      </BlogCardWrapper>
    </Link>
  );
};

export default BlogCard;
