import mongoose, { model, Schema } from "mongoose";

const trainingSchema = new Schema(
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
    summary: {
      type: String,
    },
    link: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose?.models?.training ||  model("training", trainingSchema);
