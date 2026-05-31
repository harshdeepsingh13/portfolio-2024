/**
 * Auth.js v5 (NextAuth) core configuration.
 * This file uses dynamic imports for mongoose and bcryptjs so that
 * the edge-compatible middleware can import auth.config.ts separately
 * without bundling Node.js-only modules.
 */
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Dynamic imports keep mongoose + bcryptjs out of the edge bundle.
          const { connectToDB } = await import("./lib/mongoose");
          const { default: bcrypt } = await import("bcryptjs");
          const { default: UserModel } = await import("../modals/user");

          await connectToDB();

          const user = await UserModel.findOne({
            email: credentials.email,
          }).select("+password");

          if (!user || !user.password) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            user.password as string
          );

          if (!isPasswordValid) {
            return null;
          }

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
});
