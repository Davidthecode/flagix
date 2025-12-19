import {
  Aperture,
  Cloud,
  Monitor,
  Shield,
  SlidersHorizontal,
  Zap,
} from "lucide-react";

const features = [
  {
    title: "Gradual Rollouts",
    description:
      "Ship features to 1% of users, then 10%, ensuring stability before a full release. Includes instant 'kill switch' functionality.",
    icon: Zap,
  },
  {
    title: "A/B Testing",
    description:
      "Define distinct user segments and instantly allocate traffic to variant flags for reliable outcome measurement and analysis.",
    icon: Aperture,
  },
  {
    title: "Dynamic Targeting Rules",
    description:
      "Target users based on geography, plan tier, email domain, or custom attributes via a simple, powerful dashboard.",
    icon: SlidersHorizontal,
  },
  {
    title: "Secure & Scalable SDKs",
    description:
      "Integration is fast and latency is low, powered by edge infrastructure designed for high-throughput traffic.",
    icon: Cloud,
  },
  {
    title: "Full Audit Logs & Governance",
    description:
      "Maintain SOC-2 and HIPAA compliance with comprehensive audit logs, approval workflows, and role-based access control (RBAC).",
    icon: Shield,
  },
  {
    title: "Observability Integration",
    description:
      "Connect flag changes directly to your APM/logging tools (Datadog, New Relic) to instantly detect performance impacts or errors.",
    icon: Monitor,
  },
];

export const FeaturesSection = () => {
  return (
    <section
      className="relative overflow-hidden bg-[#09090b] py-24 md:py-32"
      id="features"
    >
      {/* Background & Patterns */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-grid-white opacity-[0.05]" />
        <div className="mask-[radial-gradient(ellipse_at_center,transparent_20%,black)] absolute inset-0 bg-[#09090b]" />
      </div>

      <div className="container-landing relative z-10 mx-auto px-6">
        <div className="text-center">
          <h2 className="shimmer-text mx-auto max-w-4xl font-extrabold text-4xl tracking-tight sm:text-5xl md:text-6xl">
            Engineered for Developer Velocity
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-gray-400 text-lg leading-relaxed">
            Your core capabilities, delivered with the simplicity and power
            modern teams demand.
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                className="group relative overflow-hidden rounded-3xl border border-white/8 bg-white/2 p-8 transition-all hover:border-white/15 hover:bg-white/4"
                key={`${feature.title}-${index}`}
              >
                <div className="relative z-10">
                  <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 shadow-inner transition-transform group-hover:scale-110">
                    <Icon className="h-6 w-6 text-white" />
                  </div>

                  <h3 className="font-bold text-white text-xl tracking-tight">
                    {feature.title}
                  </h3>

                  <p className="mt-4 text-[15px] text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
