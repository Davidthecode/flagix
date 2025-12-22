import Image from "next/image";
import Link from "next/link";
import { FaGithub, FaXTwitter } from "react-icons/fa6";
import FlagixLogo from "@/public/icon.png";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-black/5 border-t bg-[#F4F4F5] pt-16 pb-0">
      <div className="container-landing mx-auto px-6">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4 lg:gap-24">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3">
              <Image
                alt="flagix logo"
                className="rounded-sm"
                height={24}
                src={FlagixLogo}
                width={24}
              />
              <span className="font-bold text-gray-900 text-xl tracking-tight">
                Flagix
              </span>
            </div>
            <p className="mt-4 max-w-xs font-medium text-gray-500 text-sm leading-relaxed">
              The collaborative feature management platform built for modern dev
              teams to ship code with confidence.
            </p>

            <div className="mt-6 flex items-center space-x-3">
              {[
                { icon: FaXTwitter, href: "https://x.com/flagixx" },
                { icon: FaGithub, href: "https://github.com/davidthecode" },
              ].map((social) => (
                <a
                  className="rounded-lg border border-black/10 bg-black/5 p-2 transition-all hover:-translate-y-0.5 hover:bg-black/10"
                  href={social.href}
                  key={social.href}
                  target="_blank"
                >
                  <social.icon className="h-4 w-4 text-gray-700" />
                </a>
              ))}

              <div className="pl-2 font-medium text-[11px] text-gray-400 uppercase tracking-wider">
                &copy; {currentYear} Flagix.
              </div>
            </div>
          </div>

          <div className="text-sm">
            <h4 className="mb-4 font-bold text-gray-900 text-xs uppercase tracking-[0.15em]">
              Product
            </h4>
            <ul className="space-y-3 font-medium text-gray-500">
              <li>
                <Link
                  className="transition-colors hover:text-gray-900"
                  href="#features"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  className="transition-colors hover:text-gray-900"
                  href="#"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  className="transition-colors hover:text-gray-900"
                  href="/docs"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  className="transition-colors hover:text-gray-900"
                  href="#"
                >
                  Changelog
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-sm">
            <h4 className="mb-4 font-bold text-gray-900 text-xs uppercase tracking-[0.15em]">
              Legal
            </h4>
            <ul className="space-y-3 font-medium text-gray-500">
              <li>
                <Link
                  className="transition-colors hover:text-gray-900"
                  href="#"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  className="transition-colors hover:text-gray-900"
                  href="#"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  className="transition-colors hover:text-gray-900"
                  href="#"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="relative mt-2 flex justify-center pt-10">
          <div className="absolute bottom-0 h-[200px] w-[500px] rounded-full bg-black/5 blur-[100px]" />

          <h2 className="shimmer-text-dark select-none font-black text-[22vw] leading-[0.8] tracking-tighter">
            Flagix
          </h2>
        </div>
      </div>
    </footer>
  );
};
