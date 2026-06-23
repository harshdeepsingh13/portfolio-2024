export interface BlogSeo {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
}

export interface BlogPostDraft {
  title?: string;
  excerpt?: string;
  coverImage?: string;
  tags?: string[];
  body_json?: Record<string, unknown>;
  body_html?: string;
  readingTime?: number;
  seo?: BlogSeo;
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  author: string;
  authorName?: string;
  coAuthors: string[];
  status: "draft" | "published";
  publishedAt?: string;
  excerpt?: string;
  coverImage?: string;
  tags: string[];
  body_json?: Record<string, unknown>;
  body_html?: string;
  readingTime?: number;
  seo?: BlogSeo;
  draft?: BlogPostDraft;
  hasDraft?: boolean;
  devToId?: string;
  linkedInId?: string;
  linkedInUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPostPreview {
  _id: string;
  title: string;
  slug: string;
  author: string;
  authorName?: string;
  status: "draft" | "published";
  publishedAt?: string;
  excerpt?: string;
  coverImage?: string;
  tags: string[];
  readingTime?: number;
  hasDraft?: boolean;
  linkedInId?: string;
  linkedInUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogAuthorSocialLinks {
  twitter?: string;
  github?: string;
  linkedin?: string;
}

export interface BlogAuthor {
  _id: string;
  email: string;
  name: string;
  bio?: string;
  avatar?: string;
  website?: string;
  socialLinks?: BlogAuthorSocialLinks;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPostForSitemap {
  slug: string;
  updatedAt: string;
}
