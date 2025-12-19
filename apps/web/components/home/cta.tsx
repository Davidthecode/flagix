import Link from "next/link";

export const CTASecion = () => (
  <section className="relative overflow-hidden border-black/5 border-t bg-[#F4F4F5] py-24 md:py-32">
    {/* background & patterns */}
    <div className="absolute inset-0 z-0">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.2]" />
      <div className="mask-[radial-gradient(ellipse_at_center,transparent_20%,black)] absolute inset-0 bg-[#F4F4F5]" />
    </div>

    <div className="container-landing relative z-10 mx-auto px-6 text-center">
      <h2 className="mx-auto max-w-3xl font-extrabold text-4xl text-gray-900 tracking-tight sm:text-5xl md:text-6xl">
        Ready to take control of your features?
      </h2>
      <p className="mx-auto mt-6 max-w-xl font-medium text-gray-500 text-lg md:text-xl">
        No credit card required. Join modern teams and start managing your
        releases today.
      </p>

      <div className="mt-10 flex flex-col items-center justify-center">
        <Link
          className="group relative rounded-full bg-gray-900 px-10 py-4 font-bold text-lg text-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all hover:scale-[0.98] hover:bg-black hover:shadow-none"
          href="/login"
        >
          <div className="absolute inset-0 rounded-full bg-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
          Start Building for Free
        </Link>
        <p className="mt-4 font-semibold text-gray-400 text-xs uppercase tracking-widest">
          Set up in less than 2 minutes
        </p>
      </div>
    </div>
  </section>
);
