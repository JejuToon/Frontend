import { useEffect, useState, useRef } from "react";
import { useStoryStore } from "../stores/useStoryStore";

export function useAudioPlayer(url: string, isLoading: boolean) {
  const { ttsConfig, ttsEnabled } = useStoryStore();
  const { volume, rate } = ttsConfig;

  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 오디오 객체 생성 및 재생
  useEffect(() => {
    if (isLoading || !ttsEnabled) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      audioRef.current = null;
      setIsPlaying(false);
      return;
    }

    // 기존 오디오 정지
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const audio = new Audio(url);
    audio.volume = volume;
    audio.playbackRate = rate;

    audioRef.current = audio;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.pause();
      audio.currentTime = 0;
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [url, isLoading, ttsEnabled]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  }, [rate]);

  // 외부 수동 재생용 함수
  const playManually = () => {
    const audio = audioRef.current;
    if (!audio || !ttsEnabled) return;
    audio.currentTime = 0;
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch((err) => {
        console.warn("Audio play error:", err);
        setIsPlaying(false);
      });
  };

  return {
    audio: audioRef.current,
    isPlaying,
    toggleAudio: () => {
      const audio = audioRef.current;
      if (!audio || !ttsEnabled) return;
      audio.paused ? audio.play() : audio.pause();
    },
    replay: () => {
      const audio = audioRef.current;
      if (audio && ttsEnabled) {
        audio.currentTime = 0;
        audio.play();
      }
    },
    playManually, // 외부에서 지연 재생 시 사용
  };
}
