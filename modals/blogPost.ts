import { Schema } from "mongoose";

const SeoSchema = new Schema(
  {
    metaTitle: { type: String },
    metaDescription: { type: String },
    ogImage: { type: String },
    canonicalUrl: { type: String },
  },
  { _id: false }
);

// Pending (unsaved-to-public) content for already-published posts.
// Root-level fields are always the live version; draft.* holds edits
// that haven't been promoted yet.
const DraftSchema = new Schema(
  {
    title: { type: String },
    excerpt: { type: String },
    coverImage: { type: String },
    tags: { type: [String] },
    body_json: { type: Schema.Types.Mixed },
    body_html: { type: String },
    readingTime: { type: Number },
    seo: { type: SeoSchema },
  },
  { _id: false }
);

export const blogPostSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    author: { type: Schema.Types.ObjectId, ref: "blogUser", required: true, index: true },
    coAuthors: { type: [Schema.Types.ObjectId], ref: "blogUser", default: [] },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    publishedAt: { type: Date },
    excerpt: { type: String },
    coverImage: { type: String },
    tags: { type: [String], default: [] },
    body_json: { type: Schema.Types.Mixed },
    body_html: { type: String },
    readingTime: { type: Number },
    seo: { type: SeoSchema },
    // Draft versioning
    draft: { type: DraftSchema },
    hasDraft: { type: Boolean, default: false },
  },
  { timestamps: true }
);
