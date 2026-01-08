
import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, X, RotateCcw } from 'lucide-react';

interface CustomPlayerProps {
  videoId: string;
  onClose: () => void;
  title: string;
}

const CustomPlayer: React.FC<CustomPlayerProps> = ({ videoId, onClose, title }) => {
  const playerRef = useRef<any>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [progress, setProgress] = useState(0);

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
  }, [videoId]);

  // Sincronización Real del Progreso
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
    let clientX = 0;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = (e as React.MouseEvent).clientX;
    }

    const pos = (clientX - rect.left) / rect.width;
    const seekTime = Math.max(0, Math.min(1, pos)) * playerRef.current.getDuration();
    
    playerRef.current.seekTo(seekTime, true);
    setProgress(pos * 100);
    if (!isPlaying) playerRef.current.playVideo();
  };

  const togglePlay = () => {
    if (!playerRef.current || !isReady) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      if (hasEnded) {
        playerRef.current.seekTo(0);
        setProgress(0);
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
    setProgress(0);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center p-0 animate-in fade-in duration-300">
      <div className="relative w-full h-full md:max-w-5xl md:aspect-video bg-black overflow-hidden shadow-2xl md:rounded-2xl border border-white/5">
        
        {/* YouTube Iframe - Recorte optimizado para ocultar UI de YT */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none scale-[1.3] translate-y-[-5%] md:translate-y-0">
          <div id={`youtube-player-${videoId}`} className="w-full h-full"></div>
        </div>

        {/* Capa de Interacción Central */}
        <div className="absolute inset-0 z-10 cursor-pointer" onClick={togglePlay}></div>

        {/* UI Overlay */}
        <div className="absolute inset-0 z-20 flex flex-col justify-between pointer-events-none">
          {/* Header - Ajustado para no chocar con el borde superior */}
          <div className="p-8 md:p-10 flex justify-between items-start pointer-events-auto">
            <button 
              onClick={(e) => { e.stopPropagation(); onClose(); }} 
              className="bg-black/50 backdrop-blur-xl p-3 rounded-full border border-white/10 active:scale-90 transition-transform"
            >
              <X size={24} className="text-white" />
            </button>
            <div className="text-right">
              <h2 className="text-white font-display text-xl md:text-3xl drop-shadow-[0_2px_15px_rgba(0,0,0,0.9)]">{title}</h2>
              <div className="h-0.5 w-10 bg-white ml-auto mt-2 rounded-full opacity-80 shadow-lg"></div>
            </div>
          </div>

          {/* Central Play Icon */}
          {!isPlaying && !hasEnded && isReady && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/10 backdrop-blur-2xl p-8 md:p-12 rounded-full border border-white/20 animate-in zoom-in duration-300 shadow-2xl">
                <Play fill="white" size={32} className="text-white md:w-12 md:h-12" />
              </div>
            </div>
          )}

          {/* Replay Overlay */}
          {hasEnded && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center pointer-events-auto backdrop-blur-sm">
              <button onClick={replay} className="flex flex-col items-center gap-4 transition-transform active:scale-95 group">
                <div className="bg-white p-6 md:p-10 rounded-full group-hover:bg-neutral-200 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                  <RotateCcw size={28} className="text-black md:w-10 md:h-10" />
                </div>
                <span className="text-white font-medium uppercase tracking-[0.3em] text-[10px] md:text-xs">Repetir Plato</span>
              </button>
            </div>
          )}

          {/* Control Bar - Elevada del fondo en móvil para consistencia con Desktop */}
          <div className="p-8 md:p-10 pb-12 md:pb-14 flex items-center justify-between pointer-events-auto bg-gradient-to-t from-black/90 via-black/40 to-transparent">
            <div className="flex gap-4 md:gap-6">
              <button 
                onClick={(e) => { e.stopPropagation(); togglePlay(); }} 
                className={`p-4 md:p-5 rounded-full border border-white/10 transition-all active:scale-90 ${isPlaying ? 'bg-white/10 text-white' : 'bg-white text-black'}`}
              >
                {isPlaying ? <Pause size={24} className="md:w-6 md:h-6" /> : <Play size={24} fill="currentColor" className="md:w-6 md:h-6" />}
              </button>
              
              <button 
                onClick={(e) => { e.stopPropagation(); toggleMute(); }} 
                className={`p-4 md:p-5 rounded-full border border-white/10 transition-all active:scale-90 ${!isMuted ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]' : 'bg-white/10 text-white'}`}
              >
                {isMuted ? <VolumeX size={24} className="md:w-6 md:h-6" /> : <Volume2 size={24} className="md:w-6 md:h-6" />}
              </button>
            </div>
            
            {!isReady && (
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse shadow-[0_0_10px_white]"></div>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white opacity-80">Cargando...</span>
              </div>
            )}
          </div>
        </div>

        {/* Barra de Progreso Interactiva - Posicionada ligeramente por encima del borde inferior absoluto */}
        <div 
          ref={progressBarRef}
          onClick={(e) => { e.stopPropagation(); handleSeek(e); }}
          onTouchStart={(e) => { e.stopPropagation(); handleSeek(e); }}
          className="absolute bottom-6 md:bottom-8 left-6 md:left-10 right-6 md:right-10 h-6 z-30 cursor-pointer group pointer-events-auto flex items-center"
        >
          {/* Fondo de la barra */}
          <div className="relative h-1 w-full bg-white/20 group-hover:h-2 transition-all rounded-full overflow-hidden">
            {/* Progreso actual */}
            <div 
              className="absolute top-0 left-0 h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] transition-all duration-100 ease-linear origin-left"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          {/* Punto de arrastre (Handle) visual */}
          <div 
            className="absolute h-3 w-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1/2 shadow-xl border border-black/20"
            style={{ left: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default CustomPlayer;
