import { Suspense } from "react";
import PageClient from "./page-client";

export const metadata = {
  title: "Project Invite",
  description: "project invite",
};

function Page() {
  <Suspense
    fallback={
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    }
  >
    <PageClient />
  </Suspense>;
}

export default Page;
