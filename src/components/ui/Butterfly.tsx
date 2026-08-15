"use client";

import { useEffect, useRef, useState } from "react";
import { usePreloader } from "@/context/PreloaderContext";
import { usePathname } from "next/navigation";
import "./Butterfly.css";

export default function Butterfly() {
  const pathname = usePathname();
  const { isFullyLoaded, isBot, stage3Butterfly } = usePreloader();
  const butterflyRef = useRef<HTMLDivElement>(null);
  const wingLeftRef = useRef<SVGSVGElement>(null);
  const wingRightRef = useRef<SVGSVGElement>(null);

  // Optimization: Only load the butterfly script and animation on the homepage
  if (pathname !== "/") return null;

  // Accessibility: Respect reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;
  if (prefersReducedMotion) return null;

  useEffect(() => {
    if (isBot || !isFullyLoaded || !stage3Butterfly) return;
    if (!butterflyRef.current || !wingLeftRef.current || !wingRightRef.current) return;

    const butterfly = butterflyRef.current;
    const wingLeft = wingLeftRef.current;
    const wingRight = wingRightRef.current;

    const STATE_IDLE = 'IDLE'; const STATE_FLEEING = 'FLEEING';
    const STATE_LANDING = 'LANDING'; const STATE_RESTING = 'RESTING';
    
    let state = STATE_IDLE;
    
    let idleTimer: NodeJS.Timeout;
    let isUserIdle = false;
    let animationFrameId: number;
    
    let x = window.innerWidth / 2; let y = window.innerHeight / 2;
    let targetX = x; let targetY = y;
    let vx = 0; let vy = 0; let angle = 0;

    let currentBank = 0; let currentPitch = 0; let currentScale = 1;
    let isGliding = false; let flapTimer = 0; let flapBurstDuration = 30;

    let mouseX = -1000; let mouseY = -1000;
    const fleeRadius = 250; 

    const updateMouse = (ex: number, ey: number) => { 
      mouseX = ex; 
      mouseY = ey; 
      resetIdleTimer();
    };
    const handleMouseMove = (e: MouseEvent) => updateMouse(e.clientX, e.clientY);
    const handleTouchStart = (e: TouchEvent) => updateMouse(e.touches[0].clientX, e.touches[0].clientY);
    const handleTouchMove = (e: TouchEvent) => updateMouse(e.touches[0].clientX, e.touches[0].clientY);
    const handleTouchEnd = () => { 
      mouseX = -1000; 
      mouseY = -1000; 
      resetIdleTimer();
    };

    window.addEventListener('mousemove', handleMouseMove, {passive: true});
    window.addEventListener('touchstart', handleTouchStart, {passive: true});
    window.addEventListener('touchmove', handleTouchMove, {passive: true});
    window.addEventListener('touchend', handleTouchEnd, {passive: true});

    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const deltaY = currentScrollY - lastScrollY;
      y -= deltaY; targetY -= deltaY;
      
      if (y < -100 || y > window.innerHeight + 100) {
        state = STATE_IDLE;
        targetX = 100 + Math.random() * (window.innerWidth - 200);
        targetY = 100 + Math.random() * (window.innerHeight - 200);
      }
      lastScrollY = currentScrollY;
      resetIdleTimer();
    };
    window.addEventListener('scroll', handleScroll, {passive: true});

    function resetIdleTimer() {
      isUserIdle = false;
      if (idleTimer) clearTimeout(idleTimer);
      
      // If animation was stopped due to idle, restart it
      if (!animationFrameId) {
        animate();
      }
      
      idleTimer = setTimeout(() => {
        isUserIdle = true;
      }, 2000);
    }

    // Initialize idle timer
    resetIdleTimer();

    const getVisibleLandingSpots = () => {
      const spots = Array.from(document.querySelectorAll('.landing-spot'));
      return spots.filter(spot => {
        const rect = spot.getBoundingClientRect();
        return rect.top >= 0 && rect.bottom <= window.innerHeight &&
               rect.left >= 0 && rect.right <= window.innerWidth;
      });
    };

    const pickNewTarget = () => {
      if (state === STATE_RESTING || state === STATE_FLEEING) return;
      const visibleSpots = getVisibleLandingSpots();
      
      if (visibleSpots.length > 0 && Math.random() < 0.4) {
        const spot = visibleSpots[Math.floor(Math.random() * visibleSpots.length)];
        const rect = spot.getBoundingClientRect();
        targetX = rect.left + (Math.random() * (rect.width / 2));
        targetY = rect.top + 10;
        state = STATE_LANDING;
      } else {
        targetX = 100 + Math.random() * (window.innerWidth - 200);
        targetY = 100 + Math.random() * (window.innerHeight - 200);
        state = STATE_IDLE;
      }
    };
    const targetInterval = setInterval(pickNewTarget, 2500);

    function animate() {
      // Pause animation entirely if user is idle and butterfly is resting
      if (isUserIdle && state === STATE_RESTING) {
        wingLeft.style.animationPlayState = 'paused';
        wingRight.style.animationPlayState = 'paused';
        animationFrameId = 0;
        return; // Break the rAF loop
      }
      const dxMouse = x - mouseX;
      const dyMouse = y - mouseY;
      const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
      
      if (distMouse < fleeRadius) {
        if (state === STATE_RESTING) {
          vx = (dxMouse > 0 ? 5 : -5); vy = (dyMouse > 0 ? 5 : -5);
        }
        state = STATE_FLEEING;
        const evasionStrength = (fleeRadius - distMouse) / fleeRadius;
        targetX = x + dxMouse * 2 * evasionStrength;
        targetY = y + dyMouse * 2 * evasionStrength;
        targetX = Math.max(50, Math.min(window.innerWidth - 50, targetX));
        targetY = Math.max(50, Math.min(window.innerHeight - 50, targetY));
      } else if (state === STATE_FLEEING) {
        state = STATE_IDLE;
      }

      const dxTarget = targetX - x;
      const dyTarget = targetY - y;
      const distTarget = Math.sqrt(dxTarget*dxTarget + dyTarget*dyTarget);

      if (state === STATE_LANDING && distTarget < 15) state = STATE_RESTING;

      if (state === STATE_RESTING) {
        vx *= 0.5; vy *= 0.5;
        x += dxTarget * 0.1; y += dyTarget * 0.1;
      } else {
        const acc = (state === STATE_FLEEING) ? 0.04 : (state === STATE_LANDING) ? 0.002 : 0.0008;
        vx += dxTarget * acc; vy += dyTarget * acc;
        const friction = (state === STATE_FLEEING) ? 0.85 : 0.94;
        vx *= friction; vy *= friction;
      }
      
      const currentSpeed = Math.sqrt(vx*vx + vy*vy);
      const maxSpeed = (state === STATE_FLEEING) ? 18 : (state === STATE_LANDING) ? 4.5 : 3.5;
      
      if (currentSpeed > maxSpeed) {
        vx = (vx / currentSpeed) * maxSpeed; vy = (vy / currentSpeed) * maxSpeed;
      }

      if (state !== STATE_RESTING) { x += vx; y += vy; }

      let targetScale = (state === STATE_FLEEING) ? 1.3 : (state === STATE_RESTING) ? 0.6 : 1.0;
      currentScale += (targetScale - currentScale) * 0.05;
      
      let altitude = Math.max(0, currentScale - 0.6); 
      let shadowY = 5 + (altitude * 80); 
      let shadowX = 5 + (altitude * 30); 
      let shadowBlur = 3 + (altitude * 30); 
      let shadowOpacity = 0.8 - (altitude * 0.6); 
      butterfly.style.filter = `drop-shadow(${shadowX}px ${shadowY}px ${shadowBlur}px rgba(0, 0, 0, ${shadowOpacity}))`;

      let diff = 0;
      if (currentSpeed > 0.5 && state !== STATE_RESTING) {
        const targetAngle = Math.atan2(vy, vx) * (180 / Math.PI) + 90; 
        diff = targetAngle - angle;
        diff = ((diff + 180) % 360) - 180;
        if(diff < -180) diff += 360;
        angle += diff * 0.12; 
      }
      
      let targetBank = (state === STATE_RESTING) ? 0 : diff * 2.5; 
      targetBank = Math.max(-60, Math.min(60, targetBank));
      currentBank += (targetBank - currentBank) * 0.1;

      let targetPitch = (state === STATE_RESTING) ? 0 : (currentSpeed - 2) * -5;
      targetPitch = Math.max(-40, Math.min(40, targetPitch));
      currentPitch += (targetPitch - currentPitch) * 0.1;

      butterfly.style.transform = `translate3d(${x - 40}px, ${y - 40}px, 0) scale(${currentScale}) perspective(400px) rotateZ(${angle}deg) rotateX(${currentPitch}deg) rotateY(${currentBank}deg)`;

      if (state === STATE_RESTING) {
        if (Math.random() < 0.03) {
          wingLeft.style.animationPlayState = 'running';
          wingRight.style.animationPlayState = 'running';
        } else {
          wingLeft.style.animationPlayState = 'paused';
          wingRight.style.animationPlayState = 'paused';
        }
      } else if (state === STATE_FLEEING) {
        wingLeft.style.animationPlayState = 'running';
        wingRight.style.animationPlayState = 'running';
        wingLeft.style.animationDuration = '0.08s';
        wingRight.style.animationDuration = '0.08s';
      } else {
        flapTimer++;
        if (flapTimer > flapBurstDuration) {
          isGliding = !isGliding;
          flapTimer = 0;
          flapBurstDuration = isGliding ? (15 + Math.random() * 20) : (30 + Math.random() * 40);
        }
        
        if (isGliding && currentSpeed > 1.5) {
          wingLeft.style.animationPlayState = 'paused';
          wingRight.style.animationPlayState = 'paused';
        } else {
          wingLeft.style.animationPlayState = 'running';
          wingRight.style.animationPlayState = 'running';
          const flapDuration = Math.max(0.08, 0.35 - (currentSpeed * 0.03)) + 's';
          wingLeft.style.animationDuration = flapDuration;
          wingRight.style.animationDuration = flapDuration;
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('scroll', handleScroll);
      clearInterval(targetInterval);
      if (idleTimer) clearTimeout(idleTimer);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isFullyLoaded, isBot, stage3Butterfly]);

  if (isBot || !isFullyLoaded || !stage3Butterfly) return null;

  return (
    <div id="magic-butterfly" ref={butterflyRef}>
      <div className="bf-wrapper">
        <svg ref={wingLeftRef} className="bf-wing bf-wing-left" viewBox="0 0 100 130" preserveAspectRatio="none">
          <defs>
            <linearGradient id="glassLeft" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.9)"/>
              <stop offset="50%" stopColor="rgba(203, 173, 141, 0.5)"/> {/* luxury-gold */}
              <stop offset="100%" stopColor="rgba(164, 131, 116, 0.6)"/> {/* luxury-mauve */}
            </linearGradient>
          </defs>
          <path d="M 95 40 C 70 5, 20 -10, 0 15 C -5 40, 10 60, 35 70 C 15 80, 5 100, 20 115 C 40 120, 60 110, 95 60 Z" fill="url(#glassLeft)" />
          <path d="M 95 40 Q 50 15 5 20 M 95 40 Q 40 40 10 50 M 95 40 Q 50 60 35 70 M 95 60 Q 60 70 20 90 M 95 60 Q 60 100 25 110 M 95 60 Q 80 110 50 115" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" fill="none" />
          <path d="M 95 40 C 70 5, 20 -10, 0 15 C -5 40, 10 60, 35 70 C 15 80, 5 100, 20 115 C 40 120, 60 110, 95 60 Z" stroke="rgba(255,255,255,1)" strokeWidth="3" fill="none" />
          <path d="M 25 112 Q 20 125 15 130 Q 25 125 35 117" fill="url(#glassLeft)" stroke="rgba(255,255,255,1)" strokeWidth="2"/>
        </svg>
        <div className="bf-body"></div>
        <svg ref={wingRightRef} className="bf-wing bf-wing-right" viewBox="0 0 100 130" preserveAspectRatio="none">
          <defs>
            <linearGradient id="glassRight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.9)"/>
              <stop offset="50%" stopColor="rgba(203, 173, 141, 0.5)"/> {/* luxury-gold */}
              <stop offset="100%" stopColor="rgba(164, 131, 116, 0.6)"/> {/* luxury-mauve */}
            </linearGradient>
          </defs>
          <path d="M 5 40 C 30 5, 80 -10, 100 15 C 105 40, 90 60, 65 70 C 85 80, 95 100, 80 115 C 60 120, 40 110, 5 60 Z" fill="url(#glassRight)" />
          <path d="M 5 40 Q 50 15 95 20 M 5 40 Q 60 40 90 50 M 5 40 Q 50 60 65 70 M 5 60 Q 40 70 80 90 M 5 60 Q 40 100 75 110 M 5 60 Q 20 110 50 115" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" fill="none" />
          <path d="M 5 40 C 30 5, 80 -10, 100 15 C 105 40, 90 60, 65 70 C 85 80, 95 100, 80 115 C 60 120, 40 110, 5 60 Z" stroke="rgba(255,255,255,1)" strokeWidth="3" fill="none" />
          <path d="M 75 112 Q 80 125 85 130 Q 75 125 65 117" fill="url(#glassRight)" stroke="rgba(255,255,255,1)" strokeWidth="2"/>
        </svg>
      </div>
    </div>
  );
}
