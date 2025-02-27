"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type VideoSource = "youtube" | "drive" | "vimeo";

interface VideoPlayerState {
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  isReady: boolean;
}

interface YouTubePlayer {
  playVideo(): void;
  pauseVideo(): void;
  seekTo(seconds: number): void;
  getCurrentTime(): number;
  getDuration(): number;
  destroy(): void;
}

interface VimeoPlayer {
  play(): Promise<void>;
  pause(): Promise<void>;
  setCurrentTime(seconds: number): Promise<void>;
  getCurrentTime(): Promise<number>;
  getDuration(): Promise<number>;
  destroy(): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on(event: string, callback: (data?: any) => void): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  off(event: string, callback?: (data?: any) => void): void;
  loadVideo(id: number): Promise<void>;
  unload(): Promise<void>;
  getVolume(): Promise<number>;
  setVolume(volume: number): Promise<void>;
}

interface YouTubeEvent {
  data: number;
  target: YouTubePlayer;
}

interface YouTubePlayerEvents {
  onReady: (event: YouTubeEvent) => void;
  onStateChange: (event: YouTubeEvent) => void;
}

interface YouTubePlayerOptions {
  videoId: string;
  events: YouTubePlayerEvents;
}

interface YouTubeIframeAPI {
  Player: new (
    elementId: string,
    options: YouTubePlayerOptions
  ) => YouTubePlayer;
  PlayerState: {
    PLAYING: number;
    PAUSED: number;
    ENDED: number;
    BUFFERING: number;
  };
}

declare global {
  interface Window {
    YT?: YouTubeIframeAPI;
    Vimeo?: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Player: new (element: HTMLIFrameElement, options: any) => VimeoPlayer;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface VideoInfo {
  source: VideoSource;
  id: string;
}

function getVideoSource(url: string): VideoInfo | null {
  try {
    const youtubePatterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
      /youtube\.com\/embed\/([^&\n?#]+)/,
    ];

    const drivePatterns = [
      /drive\.google\.com\/file\/d\/([^/]+)/,
      /drive\.google\.com\/open\?id=([^&\n?#]+)/,
    ];

    const vimeoPatterns = [
      /vimeo\.com\/(\d+)/,
      /player\.vimeo\.com\/video\/(\d+)/,
    ];

    for (const pattern of youtubePatterns) {
      const match = url.match(pattern);
      if (match?.[1]) {
        return { source: "youtube", id: match[1] };
      }
    }

    for (const pattern of drivePatterns) {
      const match = url.match(pattern);
      if (match?.[1]) {
        return { source: "drive", id: match[1] };
      }
    }

    for (const pattern of vimeoPatterns) {
      const match = url.match(pattern);
      if (match?.[1]) {
        return { source: "vimeo", id: match[1] };
      }
    }

    return null;
  } catch {
    return null;
  }
}

interface VideoControls {
  play: () => void;
  pause: () => void;
  seekTo: (time: number) => void;
}

type PlayerRef = {
  youtube: YouTubePlayer | null;
  drive: HTMLIFrameElement | null;
  vimeo: VimeoPlayer | null;
};

export function useVideoPlayer(videoUrl: string) {
  const playerRef = useRef<PlayerRef>({
    youtube: null,
    drive: null,
    vimeo: null,
  });
  const [playerState, setPlayerState] = useState<VideoPlayerState>({
    currentTime: 0,
    duration: 0,
    isPlaying: false,
    isReady: false,
  });

  const videoInfo = useMemo(() => getVideoSource(videoUrl), [videoUrl]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (!videoInfo) return undefined;

    const setupYouTubeAPI = (): Promise<void> => {
      return new Promise((resolve) => {
        if (window.YT) {
          resolve();
          return;
        }

        if (
          document.querySelector(
            "script[src='https://www.youtube.com/iframe_api']"
          )
        ) {
          window.onYouTubeIframeAPIReady = () => resolve();
          return;
        }

        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        window.onYouTubeIframeAPIReady = () => resolve();
        document.body.appendChild(tag);
      });
    };

    const setupVimeoAPI = (): Promise<void> => {
      return new Promise((resolve) => {
        if (window.Vimeo) {
          resolve();
          return;
        }

        const tag = document.createElement("script");
        tag.src = "https://player.vimeo.com/api/player.js";
        tag.onload = () => resolve();
        document.body.appendChild(tag);
      });
    };

    const createYouTubePlayer = async () => {
      await setupYouTubeAPI();

      const YT = window.YT;
      if (!YT) return;

      playerRef.current.youtube = new YT.Player("video-player", {
        videoId: videoInfo.id,
        events: {
          onReady: () => {
            setPlayerState((prev) => ({ ...prev, isReady: true }));
            startTimeTracking();
          },
          onStateChange: (event: YouTubeEvent) => {
            setPlayerState((prev) => ({
              ...prev,
              isPlaying: event.data === YT.PlayerState.PLAYING,
            }));
          },
        },
      });
    };

    const createVimeoPlayer = async () => {
      await setupVimeoAPI();

      const Vimeo = window.Vimeo;
      if (!Vimeo) return;

      const container = document.getElementById("video-player");
      if (!container) return;

      const iframe = document.createElement("iframe");
      iframe.src = `https://player.vimeo.com/video/${videoInfo.id}`;
      iframe.width = "100%";
      iframe.height = "100%";
      iframe.style.border = "none";
      iframe.allow = "autoplay; fullscreen";
      container.innerHTML = "";
      container.appendChild(iframe);

      const player = new Vimeo.Player(iframe, {});
      playerRef.current.vimeo = player;

      player.on("loaded", () => {
        setPlayerState((prev) => ({ ...prev, isReady: true }));
        startVimeoTimeTracking();
      });

      player.on("play", () => {
        setPlayerState((prev) => ({ ...prev, isPlaying: true }));
      });

      player.on("pause", () => {
        setPlayerState((prev) => ({ ...prev, isPlaying: false }));
      });
    };

    const createDrivePlayer = () => {
      if (!videoInfo) return;

      const iframe = document.createElement("iframe");
      iframe.src = `https://drive.google.com/file/d/${videoInfo.id}/preview`;
      iframe.width = "100%";
      iframe.height = "100%";
      iframe.style.border = "none";
      iframe.allow = "autoplay";

      const container = document.getElementById("video-player");
      if (container) {
        container.innerHTML = "";
        container.appendChild(iframe);
        playerRef.current.drive = iframe;
        setPlayerState((prev) => ({ ...prev, isReady: true }));
      }
    };

    const startTimeTracking = () => {
      interval = setInterval(() => {
        const player = playerRef.current.youtube;
        if (player && typeof player.getCurrentTime === "function") {
          setPlayerState((prev) => ({
            ...prev,
            currentTime: player.getCurrentTime(),
            duration: player.getDuration(),
          }));
        }
      }, 500);
    };

    const startVimeoTimeTracking = () => {
      interval = setInterval(async () => {
        const player = playerRef.current.vimeo;
        if (player) {
          try {
            const [currentTime, duration] = await Promise.all([
              player.getCurrentTime(),
              player.getDuration(),
            ]);
            setPlayerState((prev) => ({
              ...prev,
              currentTime,
              duration,
            }));
          } catch (error) {
            console.error("Error tracking Vimeo time:", error);
          }
        }
      }, 500);
    };

    if (videoInfo.source === "youtube") {
      void createYouTubePlayer();
    } else if (videoInfo.source === "vimeo") {
      void createVimeoPlayer();
    } else {
      createDrivePlayer();
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }

      if (playerRef.current.youtube) {
        playerRef.current.youtube.destroy();
      }

      if (playerRef.current.vimeo) {
        playerRef.current.vimeo.destroy();
      }

      const container = document.getElementById("video-player");
      if (container) {
        container.innerHTML = "";
      }

      playerRef.current = { youtube: null, drive: null, vimeo: null };
    };
  }, [videoUrl, videoInfo]);

  const controls: VideoControls = {
    play: () => {
      if (videoInfo?.source === "youtube") {
        playerRef.current.youtube?.playVideo?.();
      } else if (videoInfo?.source === "vimeo") {
        void playerRef.current.vimeo?.play?.();
      }
    },
    pause: () => {
      if (videoInfo?.source === "youtube") {
        playerRef.current.youtube?.pauseVideo?.();
      } else if (videoInfo?.source === "vimeo") {
        void playerRef.current.vimeo?.pause?.();
      }
    },
    seekTo: (time: number) => {
      if (videoInfo?.source === "youtube") {
        playerRef.current.youtube?.seekTo?.(time);
      } else if (videoInfo?.source === "vimeo") {
        void playerRef.current.vimeo?.setCurrentTime?.(time);
      }
    },
  };

  return {
    ...playerState,
    controls,
    videoSource: videoInfo?.source,
  };
}
