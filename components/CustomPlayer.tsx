
import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, X, RotateCcw, Plus, ShoppingBag } from 'lucide-react';
import { Dish } from '../types';

interface CustomPlayerProps {
  dish: Dish;
  onClose: () => void;
  onAddToOrder: (dish: Dish) => void;
}

const CustomPlayer: React.FC<CustomPlayerProps> = ({ dish, onClose, onAddToOrder }) => {
  const playerRef = useRef<any>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    const initPlayer = () => {
      if (window.YT && typeof window.YT.Player === 'function') {
        playerRef.current = new window.YT.Player(`youtube-player-${dish.id}`, {
          videoId: dish.videoId,
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
                setProgress(100);
              }
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
  }, [dish.id, dish.videoId]);

  useEffect(() => {
    let progressInterval: number;
    if (isPlaying && isReady && playerRef.current) {
      progressInterval = window.setInterval(() => {
        const currentTime = playerRef.current.getCurrentTime();
        const duration = playerRef.current.getDuration();
        if (duration > 0) {
          setProgress((currentTime / duration) * 100);
        }
      }, 100);
    }
    return () => { if (progressInterval) clearInterval(progressInterval); };
  }, [isPlaying, isReady]);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!playerRef.current || !isReady || !progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    let clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const pos = (clientX - rect.left) / rect.width;
    const seekTime = Math.max(0, Math.min(1, pos)) * playerRef.current.getDuration();
    playerRef.current.seekTo(seekTime, true);
    setProgress(pos * 100);
    if (!isPlaying) playerRef.current.playVideo();
  };

  const handleOrderAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToOrder(dish);
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 2000);
  };

  const togglePlay = () => {
    if (!playerRef.current || !isReady) return;
    isPlaying ? playerRef.current.pauseVideo() : playerRef.current.playVideo();
  };

  const toggleMute = () => {
    if (!playerRef.current || !isReady) return;
    isMuted ? playerRef.current.unMute() : playerRef.current.mute();
    setIsMuted(!isMuted);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center p-0 animate-in fade-in duration-300">
      <div className="relative w-full h-full md:max-w-5xl md:aspect-video bg-black overflow-hidden shadow-2xl md:rounded-2xl border border-white/5">
        
        {/* YouTube Iframe */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none scale-[1.3] translate-y-[-5%] md:translate-y-0">
          <div id={`youtube-player-${dish.id}`} className="w-full h-full"></div>
        </div>

        {/* Interaction Layer */}
        <div className="absolute inset-0 z-10 cursor-pointer" onClick={togglePlay}></div>

        {/* UI Overlay */}
        <div className="absolute inset-0 z-20 flex flex-col justify-between pointer-events-none">
          {/* Header */}
          <div className="p-8 md:p-10 flex justify-between items-start pointer-events-auto">
            <button onClick={onClose} className="bg-black/50 backdrop-blur-xl p-3 rounded-full border border-white/10 active:scale-90 transition-transform">
              <X size={24} className="text-white" />
            </button>
            <div className="text-right">
              <h2 className="text-white font-display text-xl md:text-3xl drop-shadow-[0_2px_15px_rgba(0,0,0,0.9)]">{dish.title}</h2>
              <div className="h-0.5 w-10 bg-white ml-auto mt-2 rounded-full opacity-80 shadow-lg"></div>
            </div>
          </div>

          {/* Toast de Confirmación */}
          {showConfirmation && (
            <div className="absolute top-24 left-1/2 -translate-x-1/2 bg-amber-900 text-white px-6 py-2 rounded-full border border-white/20 shadow-2xl animate-in slide-in-from-top duration-300 flex items-center gap-2 z-[60]">
              <ShoppingBag size={14} />
              <span className="text-[10px] uppercase tracking-widest font-bold">¡Plato añadido!</span>
            </div>
          )}

          {/* Central Play Icon */}
          {!isPlaying && !hasEnded && isReady && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/10 backdrop-blur-2xl p-8 md:p-12 rounded-full border border-white/20 animate-in zoom-in duration-300 shadow-2xl">
                <Play fill="white" size={32} className="text-white md:w-12 md:h-12" />
              </div>
            </div>
          )}

          {/* Control Bar con botón de pedido */}
          <div className="p-8 md:p-10 pb-12 md:pb-14 flex items-center justify-between pointer-events-auto bg-gradient-to-t from-black/90 via-black/40 to-transparent">
            <div className="flex gap-4 md:gap-6 items-center">
              <button onClick={togglePlay} className={`p-4 rounded-full border border-white/10 transition-all ${isPlaying ? 'bg-white/10 text-white' : 'bg-white text-black'}`}>
                {isPlaying ? <Pause size={24} /> : <Play size={24} fill="currentColor" />}
              </button>
              
              <button onClick={toggleMute} className={`p-4 rounded-full border border-white/10 transition-all ${!isMuted ? 'bg-white text-black' : 'bg-white/10 text-white'}`}>
                {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
              </button>
            </div>

            {/* BOTÓN ORDENAR AQUÍ MISMO */}
            <button 
              onClick={handleOrderAction}
              className="bg-amber-800 hover:bg-amber-700 text-white px-6 py-4 rounded-full flex items-center gap-3 transition-all active:scale-95 shadow-2xl border border-white/20 group"
            >
              <Plus size={20} className="group-hover:rotate-90 transition-transform" />
              <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold">Añadir al Pedido</span>
            </button>
          </div>
        </div>

        {/* Progress Bar (Seeker) */}
        <div 
          ref={progressBarRef}
          onClick={(e) => { e.stopPropagation(); handleSeek(e); }}
          onTouchStart={(e) => { e.stopPropagation(); handleSeek(e); }}
          className="absolute bottom-6 md:bottom-8 left-6 md:left-10 right-6 md:right-10 h-6 z-30 cursor-pointer group pointer-events-auto flex items-center"
        >
          <div className="relative h-1 w-full bg-white/20 group-hover:h-2 transition-all rounded-full overflow-hidden">
            <div className="absolute top-0 left-0 h-full bg-white transition-all duration-100 ease-linear" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="absolute h-3 w-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1/2 shadow-xl" style={{ left: `${progress}%` }}></div>
        </div>
      </div>
    </div>
  );
};

export default CustomPlayer;
