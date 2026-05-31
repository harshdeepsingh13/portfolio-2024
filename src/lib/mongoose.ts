// lib/mongoose.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

// ── Blog DB — separate connection ─────────────────────────────────────────────

if (!global.__mongooseBlog) {
  global.__mongooseBlog = { conn: null, promise: null };
}

export async function connectToBlogsDB(): Promise<mongoose.Connection> {
  if (global.__mongooseBlog.conn) return global.__mongooseBlog.conn;

  const BLOGS_URI = process.env.BLOGS_MONGODB_URI || MONGODB_URI;

  if (!global.__mongooseBlog.promise) {
    global.__mongooseBlog.promise = mongoose
      .createConnection(BLOGS_URI, { bufferCommands: false })
      .asPromise();
  }

  global.__mongooseBlog.conn = await global.__mongooseBlog.promise;
  return global.__mongooseBlog.conn;
}
