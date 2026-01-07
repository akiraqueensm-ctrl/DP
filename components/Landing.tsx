
import React, { useEffect, useRef } from 'react';
import { Scan, ChefHat, Sparkles } from 'lucide-react';

interface LandingProps {
  onStartScan: () => void;
}

const Landing: React.FC<LandingProps> = ({ onStartScan }) => {
  const hatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Accedemos a GSAP desde el window ya que se carga por CDN
    const gsap = (window as any).gsap;
    if (hatRef.current && gsap) {
      const tl = gsap.timeline({ delay: 0.3 });
      
      // La animación de "salto" (Jump)
      tl.to(hatRef.current, {
        opacity: 1,
        y: -50,
        scale: 1.1,
        rotation: 10,
        duration: 0.4,
        ease: "power2.out"
      })
      .to(hatRef.current, {
        y: 0,
        scale: 1,
        rotation: 0,
        duration: 0.6,
        ease: "bounce.out"
      })
      // Un pequeño efecto de "respiración" para mantenerlo vivo
      .to(hatRef.current, {
        y: -5,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-between py-20 px-8 relative overflow-hidden">
      {/* Luces de fondo ambientales */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[80%] h-[80%] bg-white/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-20%] left-[-20%] w-[100%] h-[100%] bg-neutral-900 blur-[150px] rounded-full"></div>
      </div>

      <div className="relative z-10 text-center mt-12">
        <div className="flex items-center justify-center mb-6">
          <div 
            ref={hatRef}
            className="w-20 h-20 bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 flex items-center justify-center shadow-2xl opacity-0"
          >
            <ChefHat size={36} className="text-white" />
          </div>
        </div>
        <h1 className="text-5xl font-display mb-4 tracking-tight">DishPlay</h1>
        <div className="h-0.5 w-12 bg-white/40 mx-auto mb-6 rounded-full"></div>
        <p className="text-neutral-400 text-sm font-light uppercase tracking-[0.4em]">The Video Menu Suite</p>
      </div>

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center">
        <button 
          onClick={onStartScan}
          className="group w-full py-6 bg-white text-black rounded-2xl flex items-center justify-center gap-4 transition-all hover:bg-neutral-200 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.1)] mb-6"
        >
          <Scan size={20} className="group-hover:rotate-12 transition-transform" />
          <span className="text-xs uppercase tracking-[0.3em] font-bold">Escanear Menú QR</span>
        </button>
        
        <p className="text-[10px] text-neutral-600 uppercase tracking-widest text-center px-10 leading-relaxed">
          Descubre una experiencia culinaria cinematográfica con nuestra tecnología de menú en video.
        </p>
      </div>

      <div className="relative z-10 flex items-center gap-2 opacity-30">
        <Sparkles size={12} />
        <span className="text-[10px] uppercase tracking-[0.5em] font-medium">Elevando la Hospitalidad</span>
      </div>
    </div>
  );
};

export default Landing;
