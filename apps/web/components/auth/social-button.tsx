"use client";

import type { ButtonHTMLAttributes } from "react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

type Provider = "google" | "github";

interface SocialButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  provider: Provider;
  onClick?: () => void;
  disabled?: boolean;
}

const providerInfo = {
  google: {
    icon: <FcGoogle size={18} />,
    label: "Continue with Google",
  },
  github: {
    icon: <FaGithub size={18} />,
    label: "Continue with GitHub",
  },
};

export const SocialButton = ({
  provider,
  onClick,
  disabled,
}: SocialButtonProps) => {
  const info = providerInfo[provider];
  return (
    <button
      className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-gray-300 bg-white py-2 font-medium text-gray-700 text-sm shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {info.icon}
      {info.label}
    </button>
  );
};
