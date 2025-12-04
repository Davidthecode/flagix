import Link from "next/link";

export const HeroSection = () => (
  <section className="flex min-h-screen items-center justify-center bg-[#F4F4F5]">
    <div className="container-landing text-center">
      <p className="font-semibold text-gray-600 text-sm uppercase tracking-widest">
        Control Your Codebase. Ship with Confidence.
      </p>

      <h1 className="mt-4 font-extrabold text-5xl text-gray-900 tracking-tight sm:text-6xl">
        The Feature Flag Service Built for{" "}
        <span className="text-gray-700">Modern Dev Teams.</span>
      </h1>

      <p className="mx-auto mt-6 max-w-xl text-gray-500 text-lg">
        Unlock gradual rollouts, precision A/B testing, and dynamic targeting
        without redeploying code.
      </p>

      <div className="mt-8 flex justify-center space-x-4">
        <Link
          className="rounded-lg bg-gray-900 px-6 py-3 font-semibold text-lg text-white shadow-xl transition hover:bg-gray-800"
          href="/login"
        >
          Get Started for Free
        </Link>
        <Link
          className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 text-lg shadow-sm transition hover:bg-gray-50"
          href="/docs"
        >
          Read Docs
        </Link>
      </div>
    </div>
  </section>
);
