import Link from "next/link";

export const CTASecion = () => (
  <section className="bg-[#F4F4F5] py-20">
    <div className="container-landing text-center">
      <h2 className="font-bold text-4xl text-gray-900">
        Ready to take control of your features?
      </h2>
      <p className="mt-4 text-gray-500 text-xl">
        No credit card required. Start managing your releases today.
      </p>
      <Link
        className="mt-8 inline-block rounded-lg bg-gray-900 px-8 py-4 font-semibold text-white text-xl shadow-xl transition hover:bg-gray-800"
        href="/login"
      >
        Start for Free
      </Link>
    </div>
  </section>
);
