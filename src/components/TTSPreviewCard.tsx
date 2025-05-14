import React, { useRef, useEffect } from "react";
import styled from "styled-components";
import { FaPlay, FaPause } from "react-icons/fa6";

interface TTSPreviewCardProps {
  profileUrl?: string;
  message: string;
  audioUrl: string;
  volume: number;
  rate: number;
  onPlayRequest: (audio: HTMLAudioElement) => void;
  isPlaying: boolean;
}

export default function TTSPreviewCard({
  profileUrl,
  message,
  audioUrl,
  volume,
  rate,
  onPlayRequest,
  isPlaying,
}: TTSPreviewCardProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.playbackRate = rate;
    }
  }, [volume, rate]);

  const handlePlay = () => {
    if (!audioRef.current) return;
    onPlayRequest(audioRef.current);

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  return (
    <Card>
      <Profile src={profileUrl} alt="Profile" />
      <Message>{message}</Message>
      <PlayButton onClick={handlePlay}>
        {isPlaying ? <FaPause /> : <FaPlay />}
      </PlayButton>
      <audio ref={audioRef} src={audioUrl} />
    </Card>
  );
}

const Card = styled.div`
  display: flex;
  align-items: center;
  background-color: #f5f4fa;
  color: #333;
  border-radius: 20px;
  padding: 8px 12px;
  margin-bottom: 10px;
  width: 100%;
  box-sizing: border-box;
  box-shadow: 0px 3px 10px rgba(50, 50, 50, 0.1);
`;

const Profile = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
  flex-shrink: 0;
`;

const Message = styled.span`
  flex: 1;
  font-size: 15px;
  line-height: 1.4;
  word-break: break-word;
  padding: 0px 4px;
  word-break: keep-all;
`;

const PlayButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #4a4a4a;
  color: #fff;
  font-size: 16px;
  border: none;
  cursor: pointer;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  display: flex;

  &:hover {
    background-color: #5c5c5c;
  }
`;
