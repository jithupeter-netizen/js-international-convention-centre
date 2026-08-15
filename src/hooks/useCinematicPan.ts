import { useEffect } from "react";
import type { Viewer } from "@photo-sphere-viewer/core";

export function useCinematicPan(
  viewerRef: React.MutableRefObject<Viewer | null>,
  rotationSpeed: number = 0.002,
  pitchSpeed: number = 0,
  isActive: boolean = true
) {
  useEffect(() => {
    if (!isActive) return;
    
    let animationFrameId: number;

    const animate = () => {
      try {
        if (viewerRef.current) {
          const pos = viewerRef.current.getPosition();
          viewerRef.current.rotate({ 
            yaw: pos.yaw + rotationSpeed, 
            pitch: pos.pitch + pitchSpeed 
          });
        }
      } catch (e) {
        console.warn("Cinematic pan rotation error:", e);
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isActive, rotationSpeed, pitchSpeed, viewerRef]);
}
