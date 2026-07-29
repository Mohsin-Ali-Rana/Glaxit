import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import "./VideoPlayer.css";

import video from "../assets/sample-video.mp4";

function VideoPlayer() {
  const videoRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [loading, setLoading] = useState(true);

  const togglePlay = useCallback(() => {
    const player = videoRef.current;

    if (!player) return;

    if (player.paused) {
      player.play();
      setIsPlaying(true);
    } else {
      player.pause();
      setIsPlaying(false);
    }
  }, []);

const toggleMute = useCallback(() => {
  const player = videoRef.current;

  if (!player) return;

  const newMutedState = !player.muted;
  player.muted = newMutedState;
  setMuted(newMutedState);
}, []);

  const updateProgress = useCallback(() => {
    const player = videoRef.current;

    if (!player) return;

    const value = (player.currentTime / player.duration) * 100;

    setProgress(value || 0);
    setCurrentTime(player.currentTime);
  }, []);

  const seekVideo = useCallback((e) => {
    const player = videoRef.current;

    if (!player) return;

    const newTime = (e.target.value / 100) * player.duration;

    player.currentTime = newTime;

    setProgress(e.target.value);
  }, []);

  useEffect(() => {
    const player = videoRef.current;

    const loaded = () => {
      setDuration(player.duration);
      setLoading(false);
    };

    player.addEventListener("loadedmetadata", loaded);
    player.addEventListener("timeupdate", updateProgress);

    return () => {
      player.removeEventListener("loadedmetadata", loaded);
      player.removeEventListener("timeupdate", updateProgress);
    };
  }, [updateProgress]);

  const formatTime = useCallback((time) => {
    const minutes = Math.floor(time / 60);

    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, []);

  const totalDuration = useMemo(() => {
    return formatTime(duration);
  }, [duration, formatTime]);

  const current = useMemo(() => {
    return formatTime(currentTime);
  }, [currentTime, formatTime]);

  return (
    <div className="video-card">

      {loading && (
        <div className="loading">
          Loading Video...
        </div>
      )}
        <video
        ref={videoRef}
        className="video"
        src={video}
        controls={false}
        onVolumeChange={() => setMuted(videoRef.current.muted)}
        />

      <div className="controls">

        <button onClick={togglePlay}>
          {isPlaying ? "Pause" : "Play"}
        </button>

        <button onClick={toggleMute}>
          {isMuted ? "Unmute" : "Mute"}
        </button>

        <div className="time">
          {current} / {totalDuration}
        </div>

      </div>

      <input
        type="range"
        min="0"
        max="100"
        value={progress}
        onChange={seekVideo}
        className="progress"
      />

    </div>
  );
}

export default VideoPlayer;