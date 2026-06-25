import React, { useEffect, useRef, useState } from "react";

// Array of tracks matching the files in public/music/
const PLAYLIST = [
  {
    name: "Ocean Waves",
    src: "/music/alex-morgan-ocean-waves-chill.mp3",
  },
  {
    name: "Healing Water",
    src: "/music/konstantinpazuzustudio_healing-water.mp3",
  },
  { name: "Underwater", src: "/music/musicword-underwater.mp3" },
  { name: "Faraway Bird", src: "/music/river-with-faraway-bird.mp3" },
];

interface MusicPlayerProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function MusicPlayer({ className, style }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Track the index of the currently active song. -1 means music is turned off.
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(-1);

  // Synchronize audio playback whenever the track index changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // If index is -1, stop playback and reset the audio source
    if (currentTrackIndex === -1) {
      audio.pause();
      audio.src = "";
      return;
    }

    // Update the source to the current track and play it
    audio.src = PLAYLIST[currentTrackIndex].src;
    audio.volume = 0.46;

    audio.play().catch((err) => {
      console.log(
        "Playback interrupted or blocked by browser auto-play policy:",
        err,
      );
    });
  }, [currentTrackIndex]);

  // Clean up and pause audio if the component unmounts
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  // Cycle to the next track when the button is clicked
  const handleNextTrack = () => {
    setCurrentTrackIndex((prevIndex) => {
      // If we are on the last track, turn the music off (-1)
      if (prevIndex === PLAYLIST.length - 1) {
        return -1;
      }
      // Otherwise, advance to the next track
      return prevIndex + 1;
    });
  };

  // Automatically advance to the next song when the current one finishes playing
  const handleSongEnded = () => {
    setCurrentTrackIndex((prevIndex) => {
      // Loop back to the first song if the playlist finishes automatically
      if (prevIndex === PLAYLIST.length - 1) {
        return 0;
      }
      return prevIndex + 1;
    });
  };

  const isPlaying = currentTrackIndex !== -1;

  return (
    <>
      {/* Remove the hardcoded loop attribute so the onEnded event can trigger */}
      <audio ref={audioRef} onEnded={handleSongEnded} preload="none" />
      <button
        className={className}
        style={style}
        onClick={handleNextTrack}
        aria-pressed={isPlaying}
      >
        <span style={{ fontSize: "16px" }}>{isPlaying ? "🔊" : "🎵"}</span>
        {isPlaying
          ? `${PLAYLIST[currentTrackIndex].name.toUpperCase()}`
          : "MUSIC OFF"}
      </button>
    </>
  );
}
