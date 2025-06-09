import mongoose, { model, Schema } from "mongoose";

const workExperienceSchema = new Schema(
  {
    user: {
      type: String,
      required: true,
      index: true,
    },
    company: {
      type: String,
    },
    position: {
      type: String,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    isPresent: {
      type: Boolean,
    },
    responsibilities: {
      type: String,
    },
    location: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose?.models?.workExperience || model("workExperience", workExperienceSchema);
