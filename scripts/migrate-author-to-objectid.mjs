import "dotenv/config";
import mongoose from "mongoose";

const BLOGS_MONGODB_URI = process.env.BLOGS_MONGODB_URI;
const MONGODB_URI = process.env.MONGODB_URI;
const UESR_EMAIL = process.env.UESR_EMAIL;

if (!BLOGS_MONGODB_URI || !MONGODB_URI || !UESR_EMAIL) {
  console.error("Missing BLOGS_MONGODB_URI, MONGODB_URI, or UESR_EMAIL in .env");
  process.exit(1);
}

// Step 1: Look up owner's ObjectId from main DB
const mainConn = await mongoose.createConnection(MONGODB_URI).asPromise();
const UserSchema = new mongoose.Schema({ name: String, email: String });
const User = mainConn.model("user", UserSchema);
const ownerUser = await User.findOne({ email: UESR_EMAIL }).select("_id");
if (!ownerUser) {
  console.error(`User not found for email: ${UESR_EMAIL}`);
  await mainConn.close();
  process.exit(1);
}
const authorObjectId = ownerUser._id;
await mainConn.close();

console.log(`Found user _id: ${authorObjectId}`);

// Step 2: Update all blog posts whose author is still a string (email)
const blogsConn = await mongoose.createConnection(BLOGS_MONGODB_URI).asPromise();
const BlogPostSchema = new mongoose.Schema({}, { strict: false });
const BlogPost = blogsConn.model("blogpost", BlogPostSchema);

const result = await BlogPost.updateMany(
  { author: { $type: "string" } },
  { $set: { author: authorObjectId } }
);

console.log(`✅ Migrated ${result.modifiedCount} blog post(s) (author string → ObjectId)`);

await blogsConn.close();
