import Link from "next/link";

export const HeroSection = () => {
  return (
    <section className="container-landing group relative py-12 md:py-24">
      <div className="border border-gray-300/90">
        <div className="grid h-32 grid-cols-12 border-gray-300/90 border-b">
          {/* Top Left: Fan/Perspective Pattern */}
          <div className="relative col-span-3 overflow-hidden border-gray-300/90 border-r">
            <div
              className="absolute inset-0 opacity-[0.4]"
              style={{
                backgroundImage:
                  "repeating-conic-gradient(from 0deg at 0% 0%, transparent 0deg, transparent 1deg, #e5e7eb 1deg, #e5e7eb 2deg)",
              }}
            />
          </div>

          <div className="relative col-span-3 border-gray-300/90 border-r" />
          <div className="relative col-span-3 border-gray-300/90 border-r" />
          <div className="relative col-span-3" />
        </div>

        <div className="grid w-full grid-cols-12 border-gray-300/90 border-b">
          {/* Left Side: Content */}
          <div className="relative col-span-12 px-8 py-24 lg:col-span-9 lg:border-gray-300/90 lg:border-r">
            <div className="max-w-3xl">
              <h1 className="font-extrabold text-4xl text-gray-900 leading-[1.1] tracking-tighter sm:text-7xl lg:text-8xl">
                Ship faster with <br className="hidden sm:block" />
                <span className="text-gray-900">Flagix control</span>
              </h1>

              <p className="mt-6 max-w-xl font-medium text-base text-gray-500 leading-relaxed sm:mt-8 sm:text-lg lg:text-xl">
                Unlock gradual rollouts, A/B testing, and dynamic targeting
                without redeploying code.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:mt-12 sm:flex-row">
                <Link
                  className="rounded-full bg-gray-900 px-8 py-4 text-center font-bold text-white transition hover:bg-black sm:px-10"
                  href="/login"
                >
                  Start Building Free
                </Link>
                <Link
                  className="flex items-center justify-center rounded-full border border-gray-300/90 bg-white px-8 py-4 font-semibold text-gray-600 transition hover:bg-gray-50 sm:px-10"
                  href="https://docs.flagix.com"
                  target="_blank"
                >
                  View Docs
                </Link>
              </div>
            </div>
          </div>

          {/* Right Side: Vertical Grid */}
          <div className="relative col-span-3 hidden grid-cols-4 lg:grid">
            <div className="relative h-full border-gray-200/60 border-r">
              <div className="absolute top-[15%] h-px w-full bg-gray-200/60" />
              <div className="absolute top-[85%] h-px w-full bg-gray-200/60" />
            </div>
            <div className="relative h-full border-gray-200/60 border-r">
              <div className="absolute top-[40%] h-px w-full bg-gray-200/60" />
            </div>
            <div className="relative h-full border-gray-200/60 border-r">
              <div className="absolute top-[10%] h-px w-full bg-gray-200/60" />
              <div className="absolute top-[60%] h-px w-full bg-gray-200/60" />
            </div>
            <div className="relative h-full">
              <div className="absolute top-1/2 h-px w-full bg-gray-200/60" />
            </div>
          </div>
        </div>

        <div className="grid min-h-[220px] grid-cols-1 md:grid-cols-3">
          <div className="relative border-gray-300/90 border-b p-10 transition-colors hover:bg-gray-50/50 md:border-r md:border-b-0">
            <div className="flex items-center gap-3">
              <span className="font-bold text-gray-400 text-xs uppercase tracking-widest">
                01. Precision
              </span>
              <div
                className="h-2 w-2"
                style={{
                  backgroundColor: "#fd6524",
                  clipPath: "polygon(0 0, 0% 100%, 100% 50%)",
                }}
              />
            </div>
            <p className="mt-4 font-medium text-gray-600 text-lg leading-snug">
              Detailed targeting rules for specific user segments and
              environments.
            </p>
          </div>

          <div className="relative border-gray-300/90 border-b p-10 transition-colors hover:bg-gray-50/50 md:border-r md:border-b-0">
            <div className="flex items-center gap-3">
              <span className="font-bold text-gray-400 text-xs uppercase tracking-widest">
                02. Velocity
              </span>
              <div
                className="h-2 w-2"
                style={{
                  backgroundColor: "#fd6524",
                  clipPath: "polygon(0 0, 0% 100%, 100% 50%)",
                }}
              />
            </div>
            <p className="mt-4 font-medium text-gray-600 text-lg leading-snug">
              Decouple deploy from release. Ship code to production safely and
              instantly.
            </p>
          </div>

          <div className="relative p-10 transition-colors hover:bg-gray-50/50">
            <div className="flex items-center gap-3">
              <span className="font-bold text-gray-400 text-xs uppercase tracking-widest">
                03. Insight
              </span>
              <div
                className="h-2 w-2"
                style={{
                  backgroundColor: "#fd6524",
                  clipPath: "polygon(0 0, 0% 100%, 100% 50%)",
                }}
              />
            </div>
            <p className="mt-4 font-medium text-gray-600 text-lg leading-snug">
              Real-time analytics and A/B testing results directly in your
              dashboard.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
