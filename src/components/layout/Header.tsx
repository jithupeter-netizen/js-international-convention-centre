"use client";

import { useEffect, useState, useRef } from "react";
import { Menu, X } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import clsx from "clsx";

import { usePathname } from "next/navigation";
import { usePreloader } from "@/context/PreloaderContext";

export default function Header() {
  const { isFullyLoaded, isBot } = usePreloader();
  const headerRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const headerContentRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const lastScrollY = useRef(0);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isBot || !isFullyLoaded) return;
    
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      let mm = gsap.matchMedia();

      mm.add({
        isDesktop: "(min-width: 768px)",
        isMobile: "(max-width: 767px)"
      }, (context) => {
        let { isDesktop } = context.conditions as { isDesktop: boolean };

        // Set initial state for scrolled header logo
        gsap.set(".scrolled-logo", { opacity: 0 });

        // Seamlessly scrub the header size and background opacity based on scroll
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: 500, // Animates over the first 500px of scrolling (matches Hero pin)
            scrub: 1, // Smooth scrubbing
          }
        });

        // Background and padding animate over the full 500px
        tl.to(bgRef.current, { opacity: 1, ease: "none", duration: 1 }, 0);
        tl.to(headerContentRef.current, { paddingTop: "1.25rem", paddingBottom: "1.25rem", ease: "none", duration: 1 }, 0);

        // Fade in the menu text and icon LATE (last 30% of scroll) so they never overlap
        tl.to(".scrolled-logo", {
          opacity: 1,
          ease: "power2.in",
          duration: 0.3
        }, 0.7);
      });
    });

    // Check scroll direction to hide/show header completely when scrolled down far enough
    const handleScroll = () => {
      // Don't hide header if mobile menu is open
      if (isMobileMenuOpen) return;

      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY.current && currentScrollY > 500) {
        setIsVisible(false); // scrolling down past initial shrink -> hide
      } else {
        setIsVisible(true);  // scrolling up -> show
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => {
      ctx.revert();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMobileMenuOpen, isFullyLoaded, isBot]);

  // Lock body scroll and focus trap when mobile menu is open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isMobileMenuOpen) return;
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
        return;
      }
      if (e.key === "Tab") {
        if (!mobileMenuRef.current) return;
        const focusableElements = mobileMenuRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        // If shift+tab and on first element, wrap to last
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } 
        // If tab and on last element, wrap to first
        else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Our Spaces", href: "/spaces" },
    { name: "360 Tour", href: "/tour" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <header
        ref={headerRef}
        className={clsx(
          "fixed top-0 left-0 w-full z-50 transition-transform duration-500 ease-in-out text-luxury-dark pointer-events-none",
          !isVisible ? "-translate-y-full" : "translate-y-0"
        )}
      >
      {/* Blurred background layer, animated by GSAP. Fixed height so it only covers the top bar. */}
      <div 
        ref={bgRef}
        className="absolute top-0 left-0 w-full h-[80px] bg-luxury-light/95 backdrop-blur-md border-b border-luxury-taupe shadow-xl opacity-0 pointer-events-auto"
      />

      {/* Header Content Wrapper */}
      <div 
        ref={headerContentRef}
        className="relative px-6 md:px-12 pt-8 pb-8 flex items-center justify-between pointer-events-auto min-h-[80px] z-50 w-full"
      >
        {/* Scrolled State: Left Text */}
        <div className="scrolled-logo font-montserrat font-black text-sm md:text-xl tracking-widest flex-1 landing-spot">
          J's INTERNATIONAL
        </div>

        {/* Scrolled State: Center Icon */}
        <div className="scrolled-logo absolute left-1/2 -translate-x-1/2 flex items-center justify-center landing-spot">
          <img src="/pix/icon.svg" className="w-8 h-8 md:w-10 md:h-10" alt="Icon" />
        </div>

        {/* Right: Hamburger / Nav */}
        <div className="flex-1 flex justify-end">
          {/* Mobile Hamburger */}
          <div className="flex items-center md:hidden">
            <button 
              className="bg-luxury-gold/90 transition-opacity p-2 -mr-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-8 h-8" strokeWidth={1.5} />
              ) : (
                <Menu className="w-8 h-8" strokeWidth={1.5} />
              )}
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                className={clsx(
                  "text-[11px] uppercase tracking-widest hover:text-luxury-mauve transition-colors",
                  (pathname === link.href || pathname === link.href + '/') ? "text-luxury-mauve font-bold" : "text-luxury-dark"
                )}
              >
                {link.name}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>

      {/* Mobile Menu Overlay */}
      <div 
        ref={mobileMenuRef}
        className={clsx(
          "fixed inset-0 bg-luxury-cream z-40 flex flex-col items-center justify-center transition-opacity duration-300 pointer-events-auto md:hidden",
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <nav role="navigation" aria-label="Mobile Navigation" className="flex flex-col items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              className={clsx(
                "text-2xl font-light uppercase tracking-widest hover:text-luxury-mauve transition-colors",
                (pathname === link.href || pathname === link.href + '/') ? "text-luxury-mauve font-bold" : "text-luxury-dark"
              )}
            >
              {link.name}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}
