import { Schema } from "mongoose";

export const blogUserSchema = new Schema(
  {
    email:    { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true, select: false },
    name:     { type: String, required: true },
  },
  { timestamps: true }
);
