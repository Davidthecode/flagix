import Image from "next/image";
import Link from "next/link";
import FlagixLogo from "@/public/icon.png";

export const Header = () => (
  <header className="sticky top-0 z-10 border-gray-100 border-b bg-white/95 backdrop-blur-sm">
    <div className="container-landing mx-auto flex h-16 items-center justify-between">
      <div className="flex items-center space-x-3">
        <Image
          alt="flagix logo"
          className="rounded-sm"
          height={24}
          src={FlagixLogo}
          width={24}
        />
        <span className="font-bold text-gray-900 text-xl">Flagix</span>
      </div>

      <nav className="hidden space-x-6 font-medium text-gray-600 text-sm sm:flex">
        <a className="transition hover:text-gray-900" href="#features">
          Features
        </a>
        <a className="transition hover:text-gray-900" href="#pricing">
          Pricing
        </a>
        <a className="transition hover:text-gray-900" href="#docs">
          Docs
        </a>
      </nav>

      <div className="space-x-4">
        <Link
          className="font-medium text-gray-700 text-sm transition hover:text-gray-900"
          href="/login"
        >
          Login
        </Link>
        <Link
          className="rounded-lg bg-gray-900 px-4 py-2 font-medium text-sm text-white shadow-md transition hover:bg-gray-800"
          href="/login"
        >
          Start for Free
        </Link>
      </div>
    </div>
  </header>
);
