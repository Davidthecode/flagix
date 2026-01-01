"use client";

import { Button } from "@flagix/ui/components/button";
import { Code2, Monitor } from "lucide-react";
import { useState } from "react";

export const DemoSection = () => {
  const [flagEnabled, setFlagEnabled] = useState(false);

  return (
    <section
      className="relative overflow-hidden bg-[#09090b] py-24 md:py-32"
      style={{ contain: "paint" }}
    >
      {/* Background & Patterns */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-grid-white opacity-[0.05]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#09090b_70%)]" />
      </div>

      <div className="container-landing relative z-10 mx-auto px-6">
        <div className="mb-16 text-center">
          <h2 className="shimmer-text contain-[paint] mx-auto max-w-4xl font-extrabold text-4xl tracking-tight sm:text-5xl md:text-6xl">
            Instant Control. Zero Redeploys.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-gray-400 text-lg leading-relaxed">
            Decouple code deployment from feature release. Toggle functionality
            for any user segment in milliseconds.
          </p>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <div className="rounded-3xl border border-white/8 bg-white/2 p-8 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-bold text-white text-xl tracking-tight">
                    enable-v2-interface
                  </h3>
                </div>
                <Button
                  className={`relative h-7 w-12 rounded-full transition-colors duration-300 ${flagEnabled ? "bg-emerald-500" : "bg-white/10"}`}
                  onClick={() => setFlagEnabled(!flagEnabled)}
                >
                  <div
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-all duration-300 ${flagEnabled ? "left-6" : "left-1"}`}
                  />
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-hidden rounded-3xl border border-white/8 bg-black/40 p-8 font-mono text-[13px] leading-relaxed">
              <div className="mb-6 flex items-center justify-between border-white/5 border-b pb-4">
                <div className="flex items-center gap-2 text-white/40">
                  <Code2 className="h-4 w-4" />
                  <span className="font-bold text-[10px] uppercase tracking-widest">
                    Implementation
                  </span>
                </div>
              </div>

              <div className="space-y-1 text-white/90">
                <p>
                  <span className="text-purple-400">const</span> isV2Enabled =
                  useFlag(
                  <span className="text-emerald-400">
                    "enable-v2-interface"
                  </span>
                  );
                </p>
                <p className="pt-2">
                  <span className="text-purple-400">return</span> isV2Enabled ?
                  &lt;<span className="text-emerald-400">NewUI</span> /&gt; :
                  &lt;<span className="text-gray-400">LegacyUI</span> /&gt;;
                </p>
              </div>
            </div>
          </div>

          <div className="relative min-h-[400px]">
            {/* dynamic glow effect */}
            <div
              className={`absolute inset-0 bg-emerald-500/5 blur-[100px] transition-opacity duration-1000 ${flagEnabled ? "opacity-100" : "opacity-0"}`}
            />

            <div
              className={`relative flex h-full flex-col overflow-hidden rounded-3xl border bg-white/2 transition-all duration-700 ${flagEnabled ? "border-emerald-500/40 shadow-[0_0_40px_rgba(16,185,129,0.1)]" : "border-white/8"}`}
            >
              <div className="flex items-center gap-2 border-white/5 border-b bg-black/20 px-6 py-4">
                <div className="flex gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-white/5" />
                  <div className="h-2 w-2 rounded-full bg-white/5" />
                  <div className="h-2 w-2 rounded-full bg-white/5" />
                </div>
                <div className="mx-auto rounded bg-white/5 px-3 py-1 font-mono text-[10px] text-white/20 tracking-tighter">
                  localhost:3000/dashboard
                </div>
              </div>

              <div className="flex flex-1 flex-col items-center justify-center space-y-6 p-12">
                <div
                  className={`w-full max-w-[280px] space-y-4 transition-all duration-700 ${flagEnabled ? "opacity-100" : "opacity-60"}`}
                >
                  <div
                    className={`h-3 w-24 rounded-full transition-colors duration-700 ${flagEnabled ? "bg-emerald-500/40" : "bg-white/10"}`}
                  />
                  <div className="space-y-2">
                    <div className="h-8 w-full rounded-xl border border-white/10 bg-white/5" />
                    <div className="h-24 w-full rounded-xl border border-white/10 bg-white/5" />
                  </div>
                  <div
                    className={`flex h-10 w-full items-center justify-center rounded-xl font-bold text-[11px] uppercase tracking-wide transition-all duration-700 ${flagEnabled ? "bg-emerald-500 text-white shadow-[0_10px_20px_rgba(16,185,129,0.2)]" : "bg-white/10 text-white/40"}`}
                  >
                    {flagEnabled
                      ? "Enhanced Interface Active"
                      : "Standard View"}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-white/5 border-t bg-black/20 px-6 py-4">
                <div className="flex items-center gap-2 font-bold text-[10px] text-white/20 uppercase tracking-widest">
                  <Monitor className="h-3 w-3" /> Preview
                </div>
                <div
                  className={`font-mono text-[10px] transition-colors duration-700 ${flagEnabled ? "text-emerald-500" : "text-white/20"}`}
                >
                  {flagEnabled ? "v2.0.4" : "v1.0.0"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
