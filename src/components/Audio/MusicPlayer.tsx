import React, { useEffect, useRef, useState } from "react";

interface MusicPlayerProps {
  src?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function MusicPlayer({
  src = "/music/aquarium-theme.mp3",
  className,
  style,
}: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    try {
      audio.volume = 0.46;
      await audio.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  };

  return (
    <>
      <audio ref={audioRef} src={src} loop preload="none" />
      <button
        className={className}
        style={style}
        onClick={toggleMusic}
        aria-pressed={isPlaying}
      >
        <span style={{ fontSize: "16px" }}>{isPlaying ? "🔊" : "🎵"}</span>
        {isPlaying ? "MUSIC ON" : "MUSIC"}
      </button>
    </>
  );
}
