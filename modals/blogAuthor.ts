import mongoose, { model, Schema } from "mongoose";

const SocialLinksSchema = new Schema(
  {
    twitter: { type: String },
    github: { type: String },
    linkedin: { type: String },
  },
  { _id: false }
);

const blogAuthorSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    bio: { type: String },
    avatar: { type: String },
    website: { type: String },
    socialLinks: { type: SocialLinksSchema },
  },
  { timestamps: true }
);

export default mongoose?.models?.blogAuthor || model("blogAuthor", blogAuthorSchema);
