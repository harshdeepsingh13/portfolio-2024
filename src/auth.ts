import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  pages: { signIn: "/admin/login" },
  session: { strategy: "jwt", maxAge: 4 * 60 * 60 },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const { connectToBlogsDB } = await import("./lib/mongoose");
          const { default: bcrypt } = await import("bcryptjs");
          const { blogUserSchema } = await import("../modals/blogUser");
          const conn = await connectToBlogsDB();
          const BlogUser = conn.models.blogUser || conn.model("blogUser", blogUserSchema);
          const user = await BlogUser.findOne({ email: credentials.email }).select("+password");
          if (!user || !user.password) return null;
          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            user.password as string
          );
          if (!isPasswordValid) return null;
          return {
            id: user._id.toString(),
            email: user.email as string,
            name: user.name as string,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = (user as { id: string }).id ?? token.sub ?? "";
        token.email = user.email ?? token.email ?? "";
        token.name = user.name ?? token.name ?? "";
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = (token.id as string) || "";
        session.user.email = (token.email as string) || "";
        session.user.name = (token.name as string) || "";
      }
      return session;
    },
  },
};
