/**
 * Edge-compatible Auth.js config.
 * Must NOT import mongoose, bcryptjs, or any Node.js-only module —
 * this file is imported by middleware which runs on the Edge Runtime.
 *
 * The full Credentials provider (with DB lookup) is added in src/auth.ts.
 * Middleware handles /admin route protection explicitly rather than using
 * the `authorized` callback, so only session shape callbacks live here.
 */
import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  trustHost: true,
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 4 * 60 * 60, // 4 hours
  },
  // Providers are intentionally empty here. The full Credentials provider
  // is registered in src/auth.ts which runs in the Node.js runtime only.
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email ?? token.email;
        token.name = user.name ?? token.name;
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};
