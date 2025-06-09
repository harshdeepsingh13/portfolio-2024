import mongoose, { model, Schema } from "mongoose";

const projectSchema = new Schema(
  {
    user: {
      type: String,
      required: true,
      index: true,
    },
    name: {
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
    summary: {
      type: String,
    },
    link: {
      type: String,
    },
    technologyStack: {
      type: Array,
    },
    website: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose?.models?.project || model("project", projectSchema);
