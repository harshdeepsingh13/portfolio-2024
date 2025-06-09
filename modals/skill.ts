import mongoose, { model, Schema } from "mongoose";

const skillSchema = new Schema(
  {
    user: {
      type: String,
      required: true,
      index: true,
    },
    skills: Array,
  },
  {
    timestamps: true,
  }
);

export default mongoose?.models?.skill || model("skill", skillSchema);
