import mongoose, { model, Schema } from "mongoose";

const ImageSchema = new Schema(
  {
    uploadId: {
      type: String,
      required: true,
      default: "defaultAvatar.png",
    },
  },
  {
    timestamps: true,
  }
);

const SocialMediaLinksSchema = new Schema(
  {
    github: {
      type: String,
    },
    linkedin: {
      type: String,
    },
    facebook: {
      type: String,
    },
    instagram: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: ImageSchema,
      //   default: model("image", ImageSchema),
    },
    tags: {
      type: Array,
    },
    objective: String,
    contactNumber: {
      type: {
        countryCode: { type: String, required: true },
        contactNumber: { type: String, required: true },
      },
    },
    currentLocation: {
      type: String,
    },
    dob: {
      type: Date,
    },
    website: {
      type: String,
    },
    socialMediaLinks: {
      type: SocialMediaLinksSchema,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose?.models?.user || model("user", userSchema);
