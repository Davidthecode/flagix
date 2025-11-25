"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { SocialButton } from "@/components/auth/social-button";
import { useAuth } from "@/hooks/use-auth";

export const LoginForm = () => {
  const { login } = useAuth();
  const searchParams = useSearchParams();
  const callbackURL = searchParams?.get("from") || "/dashboard";
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);

  const handleLogin = async (provider: "google" | "github") => {
    if (provider === "google") {
      setIsGoogleLoading(true);
    } else {
      setIsGithubLoading(true);
    }

    try {
      await login(provider, callbackURL);
    } finally {
      if (provider === "google") {
        setIsGoogleLoading(false);
      } else {
        setIsGithubLoading(false);
      }
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-4">
      <SocialButton
        disabled={isGoogleLoading || isGithubLoading}
        onClick={() => handleLogin("google")}
        provider="google"
      />
      <SocialButton
        disabled={isGoogleLoading || isGithubLoading}
        onClick={() => handleLogin("github")}
        provider="github"
      />
    </div>
  );
};
