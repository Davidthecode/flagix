"use client";

import { SocialButton } from "@flagix/ui/components/social-button";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { FaDiscord, FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "@/hooks/use-auth";
import type { Provider } from "@/types/auth";

export const LoginForm = () => {
  const { login } = useAuth();
  const searchParams = useSearchParams();
  const callbackURL = searchParams?.get("from") || "/dashboard";
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (provider: Provider) => {
    setIsLoading(true);

    try {
      await login(provider, callbackURL);
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-col items-center">
        <h1 className="font-semibold text-2xl text-gray-900 dark:text-gray-100">
          Welcome back
        </h1>
        <p className="mt-1 text-gray-500 text-sm">
          Sign in to your account to continue
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <SocialButton
          disabled={isLoading}
          icon={<FcGoogle size={20} />}
          label="Continue with Google"
          onClick={() => handleLogin("google")}
        />
        <SocialButton
          disabled={isLoading}
          icon={
            <FaGithub className="text-gray-900 dark:text-gray-100" size={20} />
          }
          label="Continue with GitHub"
          onClick={() => handleLogin("github")}
        />
        <SocialButton
          disabled={isLoading}
          icon={<FaDiscord className="text-[#5865F2]" size={20} />}
          label="Continue with Discord"
          onClick={() => handleLogin("discord")}
        />
      </div>
    </div>
  );
};
