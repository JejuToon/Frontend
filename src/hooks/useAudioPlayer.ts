// hooks/useAudioPlayer.ts
import { useEffect, useState } from "react";

export function useAudioPlayer(
  url: string,
  volume: number,
  rate: number,
  isLoading: boolean,
  ttsEnabled: boolean
) {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (isLoading || !ttsEnabled) {
      setAudio(null);
      return;
    }
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    const newAudio = new Audio(url);
    newAudio.volume = volume;
    newAudio.playbackRate = rate;

    newAudio.play().catch((err) => console.warn("Audio play error:", err));
    setAudio(newAudio);

    return () => {
      newAudio.pause();
      newAudio.currentTime = 0;
    };
  }, [url, isLoading, ttsEnabled]);

  useEffect(() => {
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [audio]);

  return {
    audio,
    isPlaying,
    setAudio,
    toggleAudio: () => {
      if (!audio || !ttsEnabled) return;
      audio.paused ? audio.play() : audio.pause();
    },
    replay: () => {
      if (audio && ttsEnabled) {
        audio.currentTime = 0;
        audio.play();
      }
    },
  };
}
