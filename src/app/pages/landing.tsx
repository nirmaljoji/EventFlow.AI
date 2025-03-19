"use client";

import React from 'react';
import { Header } from './landing/Header';
import { HeroSection } from './landing/HeroSection';
import { PartnersSection } from './landing/PartnersSection';
import { FeaturesSection } from './landing/FeaturesSection';
import { CtaSection } from './landing/CtaSection';
import { Footer } from './landing/LandingFooter';

export function Landing() {
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