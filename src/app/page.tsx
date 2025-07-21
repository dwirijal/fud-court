'use client';

import { HeroSection } from '@/components/shared/HeroSection';

export default function HomePage() {
  return (
    <>
      <HeroSection
        title="Welcome to FudCourtt!"
        description="Your ultimate dashboard for cryptocurrency market data, DeFi analytics, and degen trading tools."
      />
      <div className="p-4">
        {/* Add more content here */}
      </div>
    </>
  );
}
