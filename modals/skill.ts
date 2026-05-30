import mongoose, { model, Schema } from "mongoose";

const skillSchema = new Schema(
  {
    user: {
      type: String,
      required: true,
      index: true,
    },
    skills: Array,
    skillCategories: {
      type: [
        {
          category: { type: String },
          description: { type: String },
          skills: [String],
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose?.models?.skill || model("skill", skillSchema);
