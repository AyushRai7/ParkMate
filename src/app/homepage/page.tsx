"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

import Navbar from "@/components/homepage/Navbar";
import HeroSection from "@/components/homepage/Hero";
import FeatureSection from "@/components/homepage/Feature";
import HowItWorks from "@/components/homepage/HowItWork";
import StatsSection from "@/components/homepage/Stats";
import CTASection from "@/components/homepage/CTA";
import Footer from "@/components/homepage/Footer";

export default function Home() {
  const router = useRouter();
  const { isUser, isOwner, loading } = useAuth();

  const handleListSpace = () => {
    if (isOwner) {
      router.push("/owner");
    } else {
      router.push("/login?role=OWNER&redirect=/owner");
    }
  };

  const handleBookSpot = () => {
    if (isUser) {
      router.push("/booking");
    } else {
      router.push("/login?role=USER&redirect=/booking");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
        <HeroSection
          onFindParking={handleBookSpot}
          onListSpace={handleListSpace}
        />
        
        <FeatureSection />
        <HowItWorks />
        <StatsSection />
        <CTASection onBookSpot={handleBookSpot} onListSpace={handleListSpace} />
      </main>

      <Footer />
    </div>
  );
}