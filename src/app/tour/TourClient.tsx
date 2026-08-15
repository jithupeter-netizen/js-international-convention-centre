"use client";

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export function TourClient() {
  return (
    <>
      <Header />
      <main id="main-content" className="bg-luxury-light min-h-screen pt-[80px] md:pt-[100px]">
        {/* Tour Title */}
        <div className="text-center py-8 md:py-12 px-6">
          <span className="text-luxury-gold uppercase tracking-[0.3em] text-sm md:text-base font-medium block mb-3">
            Immersive Virtual Tour
          </span>
          <h1 className="text-3xl md:text-5xl font-medium text-luxury-dark">
            Experience The Venue
          </h1>
        </div>

        {/* Iframe Container with border */}
        <div className="px-4 md:px-8 lg:px-16 pb-12 md:pb-16">
          <div className="relative w-full rounded-2xl overflow-hidden border border-luxury-taupe/30 shadow-2xl" style={{ aspectRatio: '16/9' }}>
            <iframe
              src="/360packs/full/index.html"
              title="360° Virtual Tour of J's International Convention Centre"
              className="absolute inset-0 w-full h-full border-none"
              allowFullScreen
              allow="gyroscope; accelerometer; xr-spatial-tracking"
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
