"use client";

import React, { createContext, useContext, useState, useRef } from "react";

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
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <AudioContext.Provider value={{ isPlaying, toggleAudio }}>
      {/* Hidden audio element that plays globally */}
      <audio ref={audioRef} src="/audio/background.mp3" preload="none" loop />
      {children}
    </AudioContext.Provider>
  );
};
