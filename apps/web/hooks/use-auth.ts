"use client";

import { useRouter } from "next/navigation";
import { env } from "@/config/env";
import { authClient } from "@/lib/auth/client";

export const useAuth = () => {
  const { data: session } = authClient.useSession();
  const router = useRouter();

  console.log("session in useAuth hook:", session);

  const login = async (provider: "google" | "github", callbackURL: string) => {
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: env.appBase + callbackURL,
      });
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logout = async () => {
    try {
      await authClient.signOut();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return {
    user: session?.user || null,
    login,
    logout,
  };
};
