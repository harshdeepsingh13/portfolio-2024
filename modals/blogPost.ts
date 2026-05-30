import mongoose, { model, Schema } from "mongoose";

const SeoSchema = new Schema(
  {
    metaTitle: { type: String },
    metaDescription: { type: String },
    ogImage: { type: String },
    canonicalUrl: { type: String },
  },
  { _id: false }
);

const blogPostSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    author: { type: String, required: true, index: true },
    coAuthors: { type: [String], default: [] },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    publishedAt: { type: Date },
    excerpt: { type: String },
    coverImage: { type: String },
    tags: { type: [String], default: [] },
    body_json: { type: Schema.Types.Mixed },
    body_html: { type: String },
    readingTime: { type: Number },
    seo: { type: SeoSchema },
  },
  { timestamps: true }
);

export default mongoose?.models?.blogPost || model("blogPost", blogPostSchema);
