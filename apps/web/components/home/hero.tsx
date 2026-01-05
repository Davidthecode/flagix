import { ChevronRight, Terminal } from "lucide-react";
import Link from "next/link";

export const HeroSection = () => (
  <section className="relative overflow-hidden bg-[#F4F4F5] py-24 sm:py-32">
    <div className="absolute inset-0 z-0">
      {/* Grid Pattern util */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.4]" />

      {/* Sweep utils */}
      <div className="light-sweep-primary" />
      <div className="light-sweep-secondary" />

      {/* Radial Mask */}
      <div className="mask-[radial-gradient(ellipse_at_center,transparent_20%,black)] absolute inset-0 bg-[#F4F4F5]" />
    </div>

    {/* Glow Orb */}
    <div className="absolute top-1/2 left-1/2 -z-10 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-100/50 blur-[120px]" />

    <div className="container-landing relative z-20 mx-auto px-6 text-center">
      <div className="group inline-flex items-center space-x-2 rounded-full border border-gray-300/50 bg-white/50 px-3 py-1 backdrop-blur-sm transition-all hover:border-gray-400">
        <span className="flex h-2 w-2 animate-pulse rounded-full bg-green-500" />
        <span className="font-medium text-gray-600 text-xs uppercase tracking-tight">
          v1.0 is live
        </span>
        <div className="h-3 w-px bg-gray-300" />
        <Link
          className="flex items-center font-bold text-gray-900 text-xs transition-transform group-hover:translate-x-0.5"
          href="https://github.com/Davidthecode/flagix/releases"
          rel="noopener"
          target="_blank"
        >
          View Changelog <ChevronRight className="ml-0.5 h-3.5 w-3.5" />
        </Link>
      </div>

      <h1 className="mx-auto mt-8 max-w-4xl font-extrabold text-6xl text-gray-900 tracking-tighter sm:text-7xl lg:text-8xl">
        Ship faster with <br />
        <span className="bg-linear-to-b from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Flagix control.
        </span>
      </h1>

      <p className="mx-auto mt-8 max-w-2xl font-medium text-gray-600 text-lg leading-relaxed sm:text-xl">
        Unlock gradual rollouts, A/B testing, and dynamic targeting without
        redeploying code.
      </p>

      <div className="mt-12 flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-5 sm:space-y-0">
        <Link
          className="rounded-full bg-gray-900 px-8 py-4 font-bold text-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition hover:scale-[0.98] hover:bg-black hover:shadow-none"
          href="/login"
        >
          Start Building Free
        </Link>
        <Link
          className="flex items-center rounded-full border border-gray-300 bg-white px-8 py-4 font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
          href="https://docs.flagix.com"
          rel="noopener"
          target="_blank"
        >
          <Terminal className="mr-2 h-4 w-4" />
          View Docs
        </Link>
      </div>
    </div>
  </section>
);
