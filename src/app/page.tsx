"use client";

import { Hero } from "@/components/sections/hero";
import { Features } from "@/components/sections/features";
import { HowItWorks } from "@/components/sections/how-it-works";
import { UseCases } from "@/components/sections/use-cases";
import { CTA } from "@/components/sections/cta";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <main className="relative flex flex-col items-center justify-center w-full">
      <div className="w-full">
        <Hero />
        <Features />
        <HowItWorks />
        <UseCases />
        <CTA />
        <Footer />
      </div>
    </main>
  );
}
