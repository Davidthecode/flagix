"use client";

import { Button } from "@flagix/ui/components/button";
import { Check } from "lucide-react";
import { useState } from "react";

const FLAGS = [
  { id: "beta", name: "new-billing-engine", type: "Beta" },
  { id: "geo", name: "regional-pricing-eu", type: "Rollout" },
  { id: "secure", name: "advanced-mfa-flow", type: "Security" },
  { id: "exp", name: "ai-search-v3", type: "Experiment" },
];

export const DemoSection = () => {
  const [flagEnabled, setFlagEnabled] = useState(false);

  return (
    <section
      className="relative overflow-hidden py-20 text-white md:py-32"
      style={{
        background:
          "linear-gradient(to bottom, #121314 0%, #121314 10%, #080808 100%)",
      }}
    >
      <div
        className={`pointer-events-none absolute top-[30%] left-1/2 h-[700px] w-[1200px] -translate-x-1/2 transition-all duration-1000 ease-in-out ${
          flagEnabled ? "scale-110 opacity-100" : "scale-100 opacity-0"
        }`}
        style={{
          background:
            "conic-gradient(from 180deg at 50% 0%, transparent 140deg, rgba(255,255,255,0.08) 180deg, transparent 220deg)",
          filter: "blur(80px)",
        }}
      />

      <div className="container-landing relative z-10 mx-auto px-6">
        <div className="max-w-5xl text-left">
          <h2 className="mb-6 text-4xl tracking-tight sm:text-7xl">
            Instant Control. Zero Redeploys.
          </h2>
          <p className="mb-8 max-w-xl text-lg text-white/50 leading-relaxed">
            Decouple code deployment from feature release. Toggle functionality
            for any user segment in milliseconds.
          </p>

          <div className="mb-16 flex items-center gap-4">
            <Button
              className={`relative h-7 w-12 rounded-full border border-white/10 transition-all duration-500 ${
                flagEnabled ? "bg-[#F5F6F5]" : "bg-white/5"
              }`}
              onClick={() => setFlagEnabled(!flagEnabled)}
            >
              <div
                className={`absolute top-1 h-[18px] w-[18px] rounded-full transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                  flagEnabled ? "left-6 bg-black" : "left-1 bg-white/40"
                }`}
              />
            </Button>
            <span
              className={`font-medium text-sm tracking-wide transition-opacity duration-500 ${flagEnabled ? "opacity-100" : "opacity-40"}`}
            >
              {flagEnabled ? "All overrides active" : "Default state"}
            </span>
          </div>
        </div>

        <div className="flex justify-center" style={{ perspective: "1500px" }}>
          <div
            className="relative w-full max-w-6xl transition-all duration-1000 ease-out"
            style={{
              transform: flagEnabled
                ? "rotateX(12deg) scale(1.02)"
                : "rotateX(12deg) scale(1)",
              transformStyle: "preserve-3d",
            }}
          >
            <div
              className={`rounded-2xl border transition-all duration-700 ${
                flagEnabled
                  ? "border-white/25 bg-[#0c0c0c] shadow-[0_0_100px_rgba(255,255,255,0.05)]"
                  : "border-white/10 bg-[#0c0c0c]/50"
              }`}
            >
              <div className="flex items-center justify-between border-white/5 border-b px-8 py-6">
                <span className="font-semibold text-white/20 text-xs uppercase tracking-[0.2em]">
                  Active Flags
                </span>
                <div className="h-2 w-2 rounded-full bg-white/10" />
              </div>

              <div className="space-y-2 p-4">
                {FLAGS.map((flag) => (
                  <div
                    className={`group flex items-center justify-between rounded-xl px-6 py-5 transition-all duration-500 ${
                      flagEnabled
                        ? "translate-x-1 bg-white/[0.03]"
                        : "opacity-30"
                    }`}
                    key={flag.id}
                  >
                    <div className="flex items-center gap-6">
                      <div className="flex flex-col">
                        <span
                          className={`font-medium text-base transition-colors ${flagEnabled ? "text-white" : "text-white/40"}`}
                        >
                          {flag.name}
                        </span>
                      </div>
                      <span className="rounded-md border border-white/5 bg-white/5 px-2.5 py-1 font-bold text-[10px] text-white/20 uppercase tracking-widest">
                        {flag.type}
                      </span>
                    </div>

                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-md border transition-all duration-700 ${
                        flagEnabled
                          ? "border-white/30 bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                          : "border-white/5"
                      }`}
                    >
                      {flagEnabled && <Check className="h-4 w-4 text-white" />}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex h-14 items-center rounded-b-2xl border-white/5 border-t bg-black/20 px-8">
                <div className="flex gap-4">
                  <div className="h-1.5 w-12 rounded-full bg-white/5" />
                  <div className="h-1.5 w-20 rounded-full bg-white/5" />
                </div>
              </div>
            </div>

            <div
              className={`absolute -bottom-10 left-1/2 h-px w-[90%] -translate-x-1/2 transition-opacity duration-1000 ${
                flagEnabled ? "opacity-100" : "opacity-0"
              }`}
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                boxShadow: "0 0 30px 2px rgba(255,255,255,0.1)",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
