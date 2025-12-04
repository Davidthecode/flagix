import { CTASecion } from "@/components/home/cta";
import { DemoSection } from "@/components/home/demo";
import { FeaturesSection } from "@/components/home/features";
import { Footer } from "@/components/home/footer";
import { Header } from "@/components/home/header";
import { HeroSection } from "@/components/home/hero";
import { TrustSection } from "@/components/home/trust";

const Page = () => (
  <div className="flex w-full items-center justify-center">
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <TrustSection />
        <DemoSection />
        <CTASecion />
        <Footer />
      </main>
    </div>
  </div>
);

export default Page;
