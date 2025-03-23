"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/landing/Header';
import { HeroSection } from '@/components/landing/HeroSection';
import { PartnersSection } from '@/components/landing/PartnersSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { CtaSection } from '@/components/landing/CtaSection';
import { Footer } from '@/components/landing/LandingFooter';
import { authService } from '@/app/services/auth';

export default function LandingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authService.isAuthenticated()) {
      router.push('/dashboard');
    } else {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="h-dvh flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 overflow-hidden">
      {/* Navigation */}
      <Header />

      {/* Hero Section with Auth Card */}
      <HeroSection />

      {/* Features Section - With AI Orchestration Visualization */}
      <FeaturesSection />

      {/* Call to Action Section */}
      <CtaSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}