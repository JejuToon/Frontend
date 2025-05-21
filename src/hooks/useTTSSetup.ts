import React, { useState } from "react";
import { useStoryStore } from "../stores/useStoryStore";
import { TTSInfo } from "../constants/ttsInfo";

export function useTTSSetup() {
  const { ttsConfig, setTTSConfig, ttsEnabled, setTtsEnabled } =
    useStoryStore();
  const [ttsExpanded, setTtsExpanded] = useState(ttsEnabled);
  const [volume, setVolume] = useState(ttsConfig.volume);
  const [rate, setRate] = useState(ttsConfig.rate);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(
    null
  );
  const [currentlyPlayingUrl, setCurrentlyPlayingUrl] = useState<string | null>(
    null
  );
  const [selectedTTSIndex, setSelectedTTSIndex] = useState(
    ttsConfig.voiceIndex
  );

  const handlePlayRequest = (audio: HTMLAudioElement, url: string) => {
    if (currentAudio && currentAudio !== audio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    if (currentAudio === audio && !audio.paused) {
      audio.pause();
      setCurrentlyPlayingUrl(null);
      return;
    }
    audio.play();
    setCurrentAudio(audio);
    setCurrentlyPlayingUrl(url);
    audio.onended = () => setCurrentlyPlayingUrl(null);
  };

  const handleToggleTts = () => {
    if (ttsEnabled) {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        setCurrentlyPlayingUrl(null);
      }
      setTtsExpanded(false);
      setTtsEnabled(false);
    } else {
      setTtsEnabled(true);
      setTtsExpanded(true);
    }
  };

  return {
    ttsEnabled,
    ttsExpanded,
    volume,
    rate,
    selectedTTSIndex,
    handlePlayRequest,
    handleToggleTts,
    setVolume,
    setRate,
    setSelectedTTSIndex,
    setTtsExpanded,
  };
}
