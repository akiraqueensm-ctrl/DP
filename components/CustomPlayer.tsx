
import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, X, RotateCcw } from 'lucide-react';

interface CustomPlayerProps {
  videoId: string;
  onClose: () => void;
  title: string;
}

const CustomPlayer: React.FC<CustomPlayerProps> = ({ videoId, onClose, title }) => {
  const playerRef = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    const initPlayer = () => {
      // Ensure YT and YT.Player are available before instantiating
      if (window.YT && typeof window.YT.Player === 'function') {
        playerRef.current = new window.YT.Player(`youtube-player-${videoId}`, {
          videoId: videoId,
          playerVars: {
            autoplay: 1,
            controls: 0,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
            iv_load_policy: 3,
            fs: 0,
            mute: 1,
            playsinline: 1,
            enablejsapi: 1,
            origin: window.location.origin
          },
          events: {
            onReady: (event: any) => {
              setIsReady(true);
              setIsPlaying(true);
              event.target.playVideo();
            },
            onStateChange: (event: any) => {
              if (event.data === 1) { // PLAYING
                setIsPlaying(true);
                setHasEnded(false);
              } else if (event.data === 2) { // PAUSED
                setIsPlaying(false);
              } else if (event.data === 0) { // ENDED
                setHasEnded(true);
                setIsPlaying(false);
              }
            },
            onError: (err: any) => {
              console.error('YouTube Player Error:', err);
            }
          }
        });
        return true;
      }
      return false;
    };

    let interval: number;
    if (!initPlayer()) {
      interval = window.setInterval(() => {
        if (initPlayer()) {
          clearInterval(interval);
        }
      }, 200);
    }

    return () => {
      document.body.style.overflow = 'auto';
      if (interval) clearInterval(interval);
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        playerRef.current.destroy();
      }
    };
  }, [videoId]);

  const togglePlay = () => {
    if (!playerRef.current || !isReady) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      if (hasEnded) {
        playerRef.current.seekTo(0);
      }
      playerRef.current.playVideo();
    }
  };

  const toggleMute = () => {
    if (!playerRef.current || !isReady) return;
    if (isMuted) {
      playerRef.current.unMute();
      setIsMuted(false);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
  };

  const replay = () => {
    if (!playerRef.current || !isReady) return;
    playerRef.current.seekTo(0);
    playerRef.current.playVideo();
    setHasEnded(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center animate-in fade-in duration-300">
      <div className="relative w-full h-full md:max-w-md md:h-[80vh] bg-neutral-900 overflow-hidden rounded-none md:rounded-2xl shadow-2xl">
        <div id={`youtube-player-${videoId}`} className="w-full h-full scale-[1.35]"></div>
        <div className="absolute inset-0 z-10 cursor-default" onClick={togglePlay}></div>
        <div className="absolute inset-0 z-20 flex flex-col justify-between pointer-events-none">
          <div className="p-6 flex justify-between items-start pointer-events-auto">
            <div className="bg-black/30 backdrop-blur-md p-3 rounded-full border border-white/10 cursor-pointer" onClick={onClose}>
              <X size={24} className="text-white" />
            </div>
            <div className="text-right">
              <h2 className="text-white font-display text-2xl drop-shadow-lg">{title}</h2>
              <div className="h-1 w-12 bg-white ml-auto mt-2 rounded-full"></div>
            </div>
          </div>

          {!isPlaying && !hasEnded && isReady && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="bg-white/10 backdrop-blur-xl p-8 rounded-full border border-white/20">
                <Play fill="white" size={40} className="text-white" />
              </div>
            </div>
          )}

          {hasEnded && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center pointer-events-auto">
              <button onClick={replay} className="flex flex-col items-center gap-4 transition-transform active:scale-95">
                <div className="bg-white p-6 rounded-full">
                  <RotateCcw size={32} className="text-black" />
                </div>
                <span className="text-white font-medium uppercase tracking-widest text-sm">Replay Dish</span>
              </button>
            </div>
          )}

          <div className="p-8 pb-12 md:pb-8 flex items-center justify-between pointer-events-auto">
            <div className="flex gap-4">
              <button onClick={togglePlay} className="bg-black/30 backdrop-blur-md p-4 rounded-full border border-white/10 transition-colors active:bg-white/20">
                {isPlaying ? <Pause size={24} /> : <Play size={24} fill="white" />}
              </button>
              <button onClick={toggleMute} className="bg-black/30 backdrop-blur-md p-4 rounded-full border border-white/10 transition-colors active:bg-white/20">
                {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
              </button>
            </div>
            {!isReady && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-xs font-light uppercase tracking-widest opacity-60">Preparing...</span>
              </div>
            )}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 h-1 bg-white/20 w-full z-30">
          {isReady && isPlaying && <div className="h-full bg-white animate-progress-expand origin-left"></div>}
        </div>
      </div>
      <style>{`
        @keyframes progress-expand { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        .animate-progress-expand { animation: progress-expand 30s linear forwards; }
      `}</style>
    </div>
  );
};

export default CustomPlayer;
