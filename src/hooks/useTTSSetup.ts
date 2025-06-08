import React, { useState } from "react";
import { useStoryStore } from "../stores/useStoryStore";

export function useTTSSetup() {
  const { ttsConfig, setTTSConfig, ttsEnabled, setTtsEnabled } =
    useStoryStore();

  const [ttsExpanded, setTtsExpanded] = useState(ttsEnabled);
  const [volume, _setVolume] = useState(ttsConfig.volume);
  const [rate, _setRate] = useState(ttsConfig.rate);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(
    null
  );
  const [currentlyPlayingUrl, setCurrentlyPlayingUrl] = useState<string | null>(
    null
  );
  const [selectedTTSIndex, _setSelectedTTSIndex] = useState(
    ttsConfig.voiceIndex
  );

  const sampleScript =
    "제주도에는 약 1만 8천여 개의 설화가 전해져 내려오고 있어";

  const handlePlayRequest = (audio: HTMLAudioElement, audioUrl: string) => {
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
    setCurrentlyPlayingUrl(audioUrl);

    audio.onended = () => {
      setCurrentlyPlayingUrl(null);
    };
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

  const setVolume = (v: number) => {
    _setVolume(v);
    setTTSConfig({ volume: v });
  };

  const setRate = (r: number) => {
    _setRate(r);
    setTTSConfig({ rate: r });
  };

  const setSelectedTTSIndex = (idx: number) => {
    _setSelectedTTSIndex(idx);
    setTTSConfig({ voiceIndex: idx });
  };

  return {
    ttsEnabled,
    ttsExpanded,
    volume,
    rate,
    selectedTTSIndex,
    currentlyPlayingUrl,
    sampleScript,
    handlePlayRequest,
    handleToggleTts,
    setVolume,
    setRate,
    setSelectedTTSIndex,
    setTtsExpanded,
  };
}
