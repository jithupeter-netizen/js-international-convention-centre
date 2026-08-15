import { Home } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="min-h-screen w-full bg-luxury-cream text-luxury-dark flex flex-col items-center justify-center relative overflow-hidden pt-20">
        
        {/* Background Decorative Gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-luxury-gold/5 rounded-full blur-[150px] pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center px-6 py-20 max-w-3xl mx-auto">
          <div className="mb-8">
            <span className="text-[150px] md:text-[200px] font-light leading-none text-transparent bg-clip-text bg-gradient-to-b from-luxury-dark to-luxury-taupe opacity-90 select-none">
              404
            </span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-medium mb-6 text-luxury-dark">
            Page Not Found
          </h1>
          
          <p className="text-lg md:text-xl text-luxury-mauve mb-12 max-w-xl">
            We couldn't find the page you're looking for. It might have been moved, deleted, or perhaps the URL is incorrect.
          </p>
          
          <a 
            href="/"
            className="px-10 py-4 bg-luxury-dark text-luxury-light text-sm uppercase tracking-widest font-bold hover:bg-luxury-dark/90 transition-colors rounded-full flex items-center gap-3 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 duration-300"
          >
            <Home className="w-5 h-5" />
            Return to Homepage
          </a>
        </div>
      </main>
      <Footer />
    </>
  );
}
