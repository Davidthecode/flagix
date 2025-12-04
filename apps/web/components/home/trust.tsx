export const TrustSection = () => (
  <section className="bg-[#F4F4F5] py-20" id="proof">
    <div className="container-landing text-center">
      <h2 className="font-semibold text-gray-600 text-xl uppercase tracking-wider">
        Built for Production. Designed for Reliability.
      </h2>

      <div className="mt-8 flex flex-wrap justify-center gap-x-10 gap-y-6 opacity-80">
        <div className="flex flex-col items-center space-y-3">
          <span className="font-bold text-5xl">&lt; 50ms</span>
          <span className="font-medium text-gray-500 text-sm uppercase">
            Flag Evaluation
          </span>
        </div>
        <div className="flex flex-col items-center space-y-3">
          <span className="font-extrabold text-5xl text-gray-900">
            &lt; 200ms
          </span>
          <span className="mt-1 font-medium text-gray-600 text-sm uppercase">
            Flag Update Propagation
          </span>
        </div>

        <div className="flex flex-col items-center space-y-3">
          <span className="font-bold text-5xl">99.99%</span>
          <span className="font-medium text-gray-500 text-sm uppercase">
            Uptime SLA
          </span>
        </div>

        <div className="flex flex-col items-center space-y-3">
          <span className="font-bold text-5xl">3+</span>
          <span className="font-medium text-gray-500 text-sm uppercase">
            Language SDKs
          </span>
        </div>

        <div className="flex flex-col items-center space-y-2">
          <span className="font-extrabold text-5xl text-gray-900">Zero</span>
          <span className="font-medium text-gray-600 text-sm uppercase tracking-widest">
            Unmitigated Outages
          </span>
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-3xl rounded-xl border border-gray-100 bg-white px-8 py-16 shadow-lg">
        <blockquote className="text-gray-600">
          "We believe feature flagging infrastructure should be fast,
          transparent, and built on stable, documented APIs. Flagix is our
          commitment to that standard."
        </blockquote>
        <p className="mt-4 font-semibold text-gray-900">— Flagix</p>
      </div>
    </div>
  </section>
);
