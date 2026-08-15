"use client";

import { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // We could log the error to an error reporting service here
    console.error(error);
  }, [error]);

  return (
    <>
      <Header />
      <main className="min-h-screen w-full bg-luxury-cream text-luxury-dark flex flex-col items-center justify-center relative overflow-hidden pt-20">
        
        {/* Background Decorative Gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-900/5 rounded-full blur-[150px] pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center px-6 py-20 max-w-3xl mx-auto">
          <div className="mb-8 p-6 bg-white/50 rounded-full border border-luxury-taupe/30">
            <AlertCircle className="w-20 h-20 text-luxury-mauve opacity-80" />
          </div>
          
          <h1 className="text-3xl md:text-5xl font-medium mb-6 text-luxury-dark">
            Something went wrong
          </h1>
          
          <p className="text-lg md:text-xl text-luxury-mauve mb-12 max-w-xl">
            We apologize, but an unexpected error has occurred. Please try again or return to the homepage.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => reset()}
              className="px-10 py-4 bg-luxury-dark text-luxury-light text-sm uppercase tracking-widest font-bold hover:bg-luxury-dark/90 transition-colors rounded-full flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 duration-300"
            >
              <RotateCcw className="w-5 h-5" />
              Try Again
            </button>
            <a 
              href="/"
              className="px-10 py-4 bg-transparent border-2 border-luxury-dark text-luxury-dark text-sm uppercase tracking-widest font-bold hover:bg-luxury-dark/5 transition-colors rounded-full flex items-center justify-center gap-3 hover:scale-105 duration-300"
            >
              Return Home
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
