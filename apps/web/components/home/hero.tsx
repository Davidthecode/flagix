"use client";

import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
} from "motion/react";
import Link from "next/link";
import { useEffect } from "react";

export const HeroSection = () => {
  const percentage = useMotionValue(0);

  useEffect(() => {
    const controls = animate(percentage, [0, 150], {
      duration: 3,
      ease: "linear",
      repeat: Number.POSITIVE_INFINITY,
      repeatDelay: 0,
    });
    return controls.stop;
  }, [percentage]);

  const mask = useMotionTemplate`radial-gradient(
    circle at 0% 0%, 
    transparent calc(${percentage}% - 175%), 
    black calc(${percentage}% - 150%), 
    transparent calc(${percentage}% - 145%), 
    transparent calc(${percentage}% - 25%), 
    black ${percentage}%, 
    transparent calc(${percentage}% + 5%)
  )`;

  return (
    <section className="container-landing group relative py-12 md:py-12">
      <div className="border border-white/10">
        <div className="grid h-32 grid-cols-12 border-white/10 border-b">
          {/* Top Left: Fan/Perspective Pattern */}
          <div className="relative col-span-3 overflow-hidden border-gray-300/10 border-r">
            <div
              className="absolute inset-0 opacity-[0.4]"
              style={{
                backgroundImage:
                  "repeating-conic-gradient(from 0deg at 0% 0%, transparent 0deg, transparent 1deg, #333 1deg, #333 2deg)",
              }}
            />
            {/* Animated Fan Overlay */}
            <motion.div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "repeating-conic-gradient(from 0deg at 0% 0%, transparent 0deg, transparent 1deg, #FD6524 1deg, #FD6524 2deg)",
                maskImage: mask,
                WebkitMaskImage: mask,
              }}
            />
          </div>

          <div className="relative col-span-3 border-white/10 border-r" />
          <div className="relative col-span-3 border-white/10 border-r" />
          <div className="relative col-span-3" />
        </div>

        <div className="grid w-full grid-cols-12 border-white/10 border-b">
          {/* Left Side: Content */}
          <div className="relative col-span-12 px-8 py-24 lg:col-span-9 lg:border-white/10 lg:border-r">
            {/* Sponge/Glow Effect */}
            <div
              className="absolute top-1/2 left-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 opacity-40 blur-[90px]"
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.12), transparent 70%)",
              }}
            />
            <div className="relative z-10 max-w-3xl">
              <h1 className="font-extrabold text-4xl text-white leading-[1.1] tracking-tighter sm:text-7xl">
                Ship faster with <br className="hidden sm:block" />
                <span className="text-white">Flagix control</span>
              </h1>

              <p className="mt-6 max-w-xl font-medium text-base text-white/60 leading-relaxed sm:mt-8 sm:text-lg lg:text-xl">
                Unlock <span className="text-white">gradual rollouts</span>,{" "}
                <span className="text-white">A/B testing</span>, and{" "}
                <span className="text-white">dynamic targeting</span> without{" "}
                <span className="text-white">redeploying code</span>.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:mt-12 sm:flex-row">
                <Link
                  className="rounded-full bg-white px-8 py-4 text-center font-bold text-black transition hover:bg-white/90 sm:px-10"
                  href="/login"
                >
                  Start Building Free
                </Link>
                <Link
                  className="flex items-center justify-center rounded-full border border-white/10 bg-black px-8 py-4 font-semibold text-gray-300 transition hover:bg-white/5 sm:px-10"
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
            {/* Column 1 */}
            <div className="relative h-full">
              <div className="absolute top-0 right-0 bottom-0 w-px overflow-hidden bg-white/10">
                <motion.div
                  animate={{ top: ["-30%", "100%"] }}
                  className="absolute top-0 left-0 h-[30%] w-full bg-linear-to-b from-transparent via-gray-500 to-transparent opacity-50"
                  transition={{
                    duration: 4,
                    ease: "linear",
                    repeat: Number.POSITIVE_INFINITY,
                    repeatDelay: 1,
                  }}
                />
              </div>

              {/* Horizontal Lines */}
              <div className="absolute top-[15%] h-px w-full overflow-hidden bg-white/10">
                <motion.div
                  animate={{ left: ["-30%", "100%"] }}
                  className="absolute top-0 left-0 h-full w-[30%] bg-linear-to-r from-transparent via-gray-500 to-transparent opacity-50"
                  transition={{
                    duration: 2,
                    ease: "linear",
                    repeat: Number.POSITIVE_INFINITY,
                    delay: 0.5,
                    repeatDelay: 2,
                  }}
                />
              </div>
              <div className="absolute top-[85%] h-px w-full overflow-hidden bg-white/10">
                <motion.div
                  animate={{ left: ["-30%", "100%"] }}
                  className="absolute top-0 left-0 h-full w-[30%] bg-linear-to-r from-transparent via-gray-500 to-transparent opacity-50"
                  transition={{
                    duration: 2,
                    ease: "linear",
                    repeat: Number.POSITIVE_INFINITY,
                    delay: 2.5,
                    repeatDelay: 2,
                  }}
                />
              </div>
            </div>

            {/* Column 2 */}
            <div className="relative h-full">
              <div className="absolute top-0 right-0 bottom-0 w-px overflow-hidden bg-white/10">
                <motion.div
                  animate={{ top: ["-30%", "100%"] }}
                  className="absolute top-0 left-0 h-[30%] w-full bg-linear-to-b from-transparent via-gray-500 to-transparent opacity-50"
                  transition={{
                    duration: 5,
                    ease: "linear",
                    repeat: Number.POSITIVE_INFINITY,
                    delay: 2,
                    repeatDelay: 0.5,
                  }}
                />
              </div>
              <div className="absolute top-[40%] h-px w-full overflow-hidden bg-white/10">
                <motion.div
                  animate={{ left: ["-30%", "100%"] }}
                  className="absolute top-0 left-0 h-full w-[30%] bg-linear-to-r from-transparent via-gray-500 to-transparent opacity-50"
                  transition={{
                    duration: 2.5,
                    ease: "linear",
                    repeat: Number.POSITIVE_INFINITY,
                    delay: 1,
                    repeatDelay: 3,
                  }}
                />
              </div>
            </div>

            {/* Column 3 */}
            <div className="relative h-full">
              <div className="absolute top-0 right-0 bottom-0 w-px overflow-hidden bg-white/10">
                <motion.div
                  animate={{ top: ["-30%", "100%"] }}
                  className="absolute top-0 left-0 h-[30%] w-full bg-linear-to-b from-transparent via-gray-500 to-transparent opacity-50"
                  transition={{
                    duration: 3.5,
                    ease: "linear",
                    repeat: Number.POSITIVE_INFINITY,
                    delay: 1,
                    repeatDelay: 2,
                  }}
                />
              </div>
              <div className="absolute top-[10%] h-px w-full overflow-hidden bg-white/10">
                <motion.div
                  animate={{ left: ["-30%", "100%"] }}
                  className="absolute top-0 left-0 h-full w-[30%] bg-linear-to-r from-transparent via-gray-500 to-transparent opacity-50"
                  transition={{
                    duration: 1.5,
                    ease: "linear",
                    repeat: Number.POSITIVE_INFINITY,
                    delay: 2,
                    repeatDelay: 4,
                  }}
                />
              </div>
              <div className="absolute top-[60%] h-px w-full overflow-hidden bg-white/10">
                <motion.div
                  animate={{ left: ["-30%", "100%"] }}
                  className="absolute top-0 left-0 h-full w-[30%] bg-linear-to-r from-transparent via-gray-500 to-transparent opacity-50"
                  transition={{
                    duration: 2,
                    ease: "linear",
                    repeat: Number.POSITIVE_INFINITY,
                    delay: 3,
                    repeatDelay: 1,
                  }}
                />
              </div>
            </div>

            {/* Column 4 */}
            <div className="relative h-full">
              <div className="absolute top-1/2 h-px w-full overflow-hidden bg-white/10">
                <motion.div
                  animate={{ left: ["-30%", "100%"] }}
                  className="absolute top-0 left-0 h-full w-[30%] bg-linear-to-r from-transparent via-gray-500 to-transparent opacity-50"
                  transition={{
                    duration: 3,
                    ease: "linear",
                    repeat: Number.POSITIVE_INFINITY,
                    delay: 0,
                    repeatDelay: 2,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid min-h-[220px] grid-cols-1 md:grid-cols-3">
          <div className="relative border-white/10 border-b p-10 transition-colors hover:bg-white/5 md:border-r md:border-b-0">
            <div className="flex items-center gap-3">
              <span className="font-bold text-gray-500 text-xs uppercase tracking-widest">
                Precision
              </span>
              <div
                className="h-2 w-2"
                style={{
                  backgroundColor: "#fd6524",
                  clipPath: "polygon(0 0, 0% 100%, 100% 50%)",
                }}
              />
            </div>
            <p className="mt-4 font-medium text-lg text-white leading-snug">
              Detailed targeting rules for specific user segments and
              environments.
            </p>
          </div>

          <div className="relative border-white/10 border-b p-10 transition-colors hover:bg-white/5 md:border-r md:border-b-0">
            <div className="flex items-center gap-3">
              <span className="font-bold text-gray-500 text-xs uppercase tracking-widest">
                Velocity
              </span>
              <div
                className="h-2 w-2"
                style={{
                  backgroundColor: "#fd6524",
                  clipPath: "polygon(0 0, 0% 100%, 100% 50%)",
                }}
              />
            </div>
            <p className="mt-4 font-medium text-lg text-white leading-snug">
              Decouple deploy from release. Ship code to production safely and
              instantly.
            </p>
          </div>

          <div className="relative p-10 transition-colors hover:bg-white/5">
            <div className="flex items-center gap-3">
              <span className="font-bold text-gray-500 text-xs uppercase tracking-widest">
                Insight
              </span>
              <div
                className="h-2 w-2"
                style={{
                  backgroundColor: "#fd6524",
                  clipPath: "polygon(0 0, 0% 100%, 100% 50%)",
                }}
              />
            </div>
            <p className="mt-4 font-medium text-lg text-white leading-snug">
              Real-time analytics and A/B testing results directly in your
              dashboard.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
