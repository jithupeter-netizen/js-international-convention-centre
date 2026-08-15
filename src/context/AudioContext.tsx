"use client";

import React, { createContext, useContext, useState, useRef } from "react";
import { usePreloader } from "@/context/PreloaderContext";

interface AudioContextType {
  isPlaying: boolean;
  toggleAudio: () => void;
}

const AudioContext = createContext<AudioContextType>({
  isPlaying: false,
  toggleAudio: () => {},
});

export const useAudio = () => useContext(AudioContext);

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const { stage4Audio, isBot } = usePreloader();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleAudio = () => {
    if (!audioRef.current) {
      // If user clicks play before stage 4, instantiate audio element immediately
      const audio = new Audio("/audio/background.mp3");
      audio.loop = true;
      audioRef.current = audio;
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <AudioContext.Provider value={{ isPlaying, toggleAudio }}>
      {/* Defer global audio element instantiation until Stage 4 (after Butterfly animation) */}
      {(!isBot && stage4Audio) && (
        <audio ref={audioRef} src="/audio/background.mp3" preload="none" loop />
      )}
      {children}
    </AudioContext.Provider>
  );
};
