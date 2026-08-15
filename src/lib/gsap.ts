import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  
  // Accessibility: Globally force GSAP animations to end state if user prefers reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.globalTimeline.timeScale(1000); // Forces all time-based tweens to complete near-instantly
    ScrollTrigger.config({ ignoreMobileResize: true }); // Reduce layout thrashing
  }
}

export { gsap, ScrollTrigger };
