import Link from "next/link";

const Page = () => (
  <div className="flex h-screen flex-col items-center justify-center space-y-2">
    <p> hi from flagix</p>
    <h1>This is the Flagix landing page!</h1>
    <div>
      <Link
        className="cursor-pointer rounded-md border px-2 py-1 text-sm transition-transform hover:scale-105"
        href="/login"
      >
        Sign In
      </Link>
    </div>
  </div>
);

export default Page;
