import type { ButtonHTMLAttributes, ReactNode } from "react";

interface SocialButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}

export const SocialButton = ({
  icon,
  label,
  onClick,
  disabled,
}: SocialButtonProps) => (
  <button
    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-gray-300 bg-white py-3 font-medium text-gray-700 text-sm transition hover:bg-[#F4F4F5] disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
    disabled={disabled}
    onClick={onClick}
    type="button"
  >
    {icon}
    {label}
  </button>
);
