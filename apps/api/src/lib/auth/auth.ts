import { db } from "@flagix/db";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { createAuthMiddleware } from "better-auth/api";
import { env } from "@/config/env";
import { sendWelcomeEmail } from "@/lib/actions/email";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  baseURL: env.API_URL as string,
  trustedOrigins: [env.FRONTEND_URL as string],
  session: {
    storeSessionInDatabase: true,
    preserveSessionInDatabase: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
    github: {
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    },
  },
  hooks: {
    after: createAuthMiddleware(async (authContext) => {
      if (authContext.path.startsWith("/sign-up")) {
        const newSession = authContext.context.newSession;
        if (newSession?.user?.email) {
          try {
            await sendWelcomeEmail({
              userEmail: newSession.user.email,
            });
          } catch (err) {
            console.error("Failed to send welcome email:", err);
          }
        }
      }
    }),
  },
});

export type AuthSession = typeof auth.$Infer.Session;
