import Link from "next/link";

const features = [
  {
    title: "Gradual Rollouts",
    description:
      "Ship to 1% of users, then 10%, ensuring stability before a full release.",
  },
  {
    title: "A/B Testing",
    description:
      "Define segments and allocate traffic to flags for reliable measurement.",
  },
  {
    title: "Dynamic Targeting",
    description:
      "Target users based on geography, plan tier, or custom attributes.",
  },
  {
    title: "Secure & Scalable SDKs",
    description:
      "Integration is fast and latency is low, powered by edge infrastructure.",
  },
  {
    title: "Full Audit Logs",
    description:
      "Maintain compliance with comprehensive logs and approval workflows.",
  },
  {
    title: "Observability",
    description:
      "Connect flag changes to your APM to detect performance impacts.",
  },
];

export const FeaturesSection = () => {
  return (
    <section className="bg-[#080808] py-24 md:py-32" id="features">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <h2 className="font-medium text-3xl text-[#f7f7f7] tracking-tight sm:text-7xl">
              Engineered for
              <br /> Developer Velocity
            </h2>
          </div>
          <div className="max-w-[400px]">
            <p className="text-[#8a8a8e] text-lg leading-relaxed">
              Flagix is designed to decouple development from releases, allowing
              your team to ship code continuously and toggle features with total
              precision.{"  "}
              <Link
                className="inline-flex items-center text-white transition-all hover:underline"
                href="/login"
              >
                Get started <span className="ml-1 text-[10px]">→</span>
              </Link>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            return (
              <div
                className="group relative flex min-h-[180px] flex-col justify-between overflow-hidden rounded-[18px] border border-white/6 bg-[#111113] p-6 transition-all hover:bg-[#141416]"
                key={`${feature.title}-${index}`}
              >
                <div className="relative z-10 flex items-end justify-between">
                  <div className="space-y-1.5">
                    <h3 className="font-medium text-[#f7f7f7] text-lg">
                      {feature.title}
                    </h3>
                    <p className="max-w-[75%] text-[#8a8a8e] leading-snug">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
