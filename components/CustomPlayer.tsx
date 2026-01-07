
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
            origin: window.location.origin,
            widget_referrer: window.location.origin
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
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-0 md:p-6 animate-in fade-in duration-300">
      {/* Container principal con relación 16:9 */}
      <div className="relative w-full max-w-5xl aspect-video bg-black overflow-hidden shadow-2xl md:rounded-2xl border border-white/5">
        
        {/* YouTube Iframe con Over-Scaling para ocultar UI de YouTube */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div id={`youtube-player-${videoId}`} className="w-full h-full scale-[1.15] pointer-events-none"></div>
        </div>

        {/* Capa Anti-Leak (Bloquea clicks directos al iframe) */}
        <div className="absolute inset-0 z-10 cursor-pointer" onClick={togglePlay}></div>

        {/* UI Overlay */}
        <div className="absolute inset-0 z-20 flex flex-col justify-between pointer-events-none">
          {/* Header */}
          <div className="p-4 md:p-8 flex justify-between items-start pointer-events-auto">
            <button 
              onClick={(e) => { e.stopPropagation(); onClose(); }} 
              className="bg-black/40 backdrop-blur-xl p-3 rounded-full border border-white/10 active:scale-90 transition-transform"
            >
              <X size={24} className="text-white" />
            </button>
            <div className="text-right">
              <h2 className="text-white font-display text-xl md:text-3xl drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">{title}</h2>
              <div className="h-0.5 w-10 bg-white ml-auto mt-2 rounded-full opacity-80"></div>
            </div>
          </div>

          {/* Central Play Icon (Solo cuando está pausado) */}
          {!isPlaying && !hasEnded && isReady && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/10 backdrop-blur-2xl p-6 md:p-10 rounded-full border border-white/20 animate-in zoom-in duration-300">
                <Play fill="white" size={32} className="text-white md:w-12 md:h-12" />
              </div>
            </div>
          )}

          {/* Replay Overlay */}
          {hasEnded && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center pointer-events-auto backdrop-blur-sm">
              <button onClick={replay} className="flex flex-col items-center gap-4 transition-transform active:scale-95 group">
                <div className="bg-white p-5 md:p-8 rounded-full group-hover:bg-neutral-200 transition-colors">
                  <RotateCcw size={28} className="text-black md:w-10 md:h-10" />
                </div>
                <span className="text-white font-medium uppercase tracking-[0.3em] text-[10px] md:text-xs">Repetir Plato</span>
              </button>
            </div>
          )}

          {/* Controls Bar */}
          <div className="p-4 md:p-8 pb-8 md:pb-10 flex items-center justify-between pointer-events-auto bg-gradient-to-t from-black/80 to-transparent">
            <div className="flex gap-3 md:gap-5">
              <button onClick={(e) => { e.stopPropagation(); togglePlay(); }} className="bg-white/10 backdrop-blur-xl p-3 md:p-5 rounded-full border border-white/10 transition-all active:scale-90 hover:bg-white/20">
                {isPlaying ? <Pause size={20} className="md:w-6 md:h-6" /> : <Play size={20} fill="white" className="md:w-6 md:h-6" />}
              </button>
              <button onClick={(e) => { e.stopPropagation(); toggleMute(); }} className="bg-white/10 backdrop-blur-xl p-3 md:p-5 rounded-full border border-white/10 transition-all active:scale-90 hover:bg-white/20">
                {isMuted ? <VolumeX size={20} className="md:w-6 md:h-6" /> : <Volume2 size={20} className="md:w-6 md:h-6" />}
              </button>
            </div>
            
            {!isReady && (
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
                <span className="text-[10px] font-medium uppercase tracking-[0.2em] opacity-80">Preparando...</span>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 h-1 bg-white/10 w-full z-30">
          {isReady && isPlaying && (
            <div className="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] animate-progress-expand origin-left"></div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes progress-expand { 
          from { transform: scaleX(0); } 
          to { transform: scaleX(1); } 
        }
        .animate-progress-expand { animation: progress-expand 30s linear forwards; }
      `}</style>
    </div>
  );
};

export default CustomPlayer;
