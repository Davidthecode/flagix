import Image from "next/image";
import Link from "next/link";
import { FaGithub, FaXTwitter } from "react-icons/fa6";
import FlagixLogo from "@/public/icon.png";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-black/5 border-t bg-[#F4F4F5] py-16">
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
              Ship faster and safer with real-time feature management
            </p>

            <div className="mt-6 flex items-center space-x-3">
              {[
                { icon: FaXTwitter, href: "https://x.com/flagixx" },
                {
                  icon: FaGithub,
                  href: "https://github.com/davidthecode/flagix",
                },
              ].map((social) => (
                <a
                  className="border-black/10 p-2 transition-all hover:-translate-y-0.5 hover:bg-black/10"
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

          <div className="text-sm md:col-start-4">
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
                  href="https://docs.flagix.com"
                  rel="noopener"
                  target="_blank"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  className="transition-colors hover:text-gray-900"
                  href="https://github.com/Davidthecode/flagix/releases"
                  rel="noopener"
                  target="_blank"
                >
                  Changelog
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};
