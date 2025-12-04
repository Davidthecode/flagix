import {
  Aperture,
  Cloud,
  Monitor,
  Shield,
  SlidersHorizontal,
  Zap,
} from "lucide-react";

export const FeaturesSection = () => {
  const features = [
    {
      title: "Gradual Rollouts",
      description:
        "Ship features to 1% of users, then 10%, ensuring stability before a full release. Includes instant 'kill switch' functionality.",
      icon: Zap,
    },
    {
      title: "Precision A/B Testing",
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

  return (
    <section className="bg-black py-24" id="features">
      <div className="container-landing mx-auto">
        <div className="text-center">
          <p className="font-semibold text-sm text-white/70 uppercase tracking-widest">
            Core Capabilities
          </p>
          <h2 className="mt-2 font-bold text-4xl text-white">
            Engineered for Developer Velocity
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-white/70 text-xl">
            Your core capabilities, delivered with the simplicity and power
            modern teams demand.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                className="group flex flex-col justify-between rounded-3xl border border-white/5 bg-[#1D1C1D] p-6 shadow-lg transition hover:shadow-2xl"
                key={`${feature.title}-${index}`}
              >
                <div className="flex items-center space-x-4">
                  <div className="text-3xl transition group-hover:scale-105">
                    <Icon className="h-6 w-6 text-white/50" />
                  </div>
                  <h3 className="font-bold text-white text-xl">
                    {feature.title}
                  </h3>
                </div>

                <p className="mt-4 text-[#777777]">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
