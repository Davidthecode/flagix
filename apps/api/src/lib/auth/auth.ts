import { db } from "@flagix/db";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { env } from "@/config/env";
import { sendWelcomeEmail } from "@/lib/actions/email";

const isProd = env.NODE_ENV === "production";

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
  advanced: {
    useSecureCookies: isProd,
    cookies: {
      state: {
        attributes: {
          sameSite: isProd ? "none" : "lax",
          secure: isProd,
        },
      },
    },
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID || "",
      clientSecret: env.GOOGLE_CLIENT_SECRET || "",
    },
    github: {
      clientId: env.GITHUB_ID || "",
      clientSecret: env.GITHUB_SECRET || "",
    },
    discord: {
      clientId: env.DISCORD_CLIENT_ID || "",
      clientSecret: env.DISCORD_CLIENT_SECRET || "",
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (newUser) => {
          if (newUser.email) {
            try {
              await sendWelcomeEmail({
                userEmail: newUser.email,
              });
            } catch (err) {
              console.error("Failed to send welcome email on sign-up:", err);
            }
          }
        },
      },
    },
  },
});

export type AuthSession = typeof auth.$Infer.Session;
