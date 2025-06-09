import mongoose, { model, Schema } from "mongoose";

const locationSchema = new Schema(
  {
    state: {
      type: String,
    },
    country: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose?.models?.location || model("location", locationSchema);
