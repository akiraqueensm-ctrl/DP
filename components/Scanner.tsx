
import React, { useEffect, useRef, useState } from 'react';
import { X, Camera, CheckCircle2 } from 'lucide-react';

interface ScannerProps {
  onScan: (id: string) => void;
  onClose: () => void;
}

const Scanner: React.FC<ScannerProps> = ({ onScan, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'scanning' | 'detected'>('scanning');

  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.warn('Camera access denied, continuing with demo mode.');
        setError('Cámara no disponible - Usando Modo Demo');
      }
    }
    startCamera();

    // Lógica de Escaneo Demo: Después de 3 segundos, detecta automáticamente "Panchita"
    const demoTimer = setTimeout(() => {
      setStatus('detected');
      setTimeout(() => {
        onScan('panchita');
      }, 1000);
    }, 3500);

    return () => {
      clearTimeout(demoTimer);
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
    };
  }, [onScan]);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
      {/* Botón Cerrar */}
      <div className="absolute top-8 left-6 right-6 flex justify-between items-center z-[110]">
        <button 
          onClick={onClose} 
          className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 active:scale-90 transition-transform pointer-events-auto"
        >
          <X size={24} />
        </button>
        <span className="text-xs uppercase tracking-[0.3em] font-semibold text-white/80">
          {status === 'scanning' ? 'Escaneando Menú' : '¡Código Detectado!'}
        </span>
        <div className="w-12 h-12"></div>
      </div>

      {/* Visor del Escáner */}
      <div className={`relative w-full aspect-square max-w-sm rounded-3xl overflow-hidden border-2 transition-colors duration-500 ${status === 'detected' ? 'border-green-500 shadow-[0_0_50px_rgba(34,197,94,0.3)]' : 'border-white/20'}`}>
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${status === 'detected' ? 'opacity-30' : 'grayscale opacity-60'}`}
        />
        
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {status === 'scanning' ? (
            <div className="w-64 h-64 border-2 border-white/30 rounded-2xl relative">
              <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-xl"></div>
              <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-xl"></div>
              <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-xl"></div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-xl"></div>
              <div className="absolute top-0 left-0 w-full h-0.5 bg-white/60 animate-scan-line shadow-[0_0_15px_rgba(255,255,255,1)]"></div>
            </div>
          ) : (
            <div className="flex flex-col items-center animate-in zoom-in duration-300">
              <CheckCircle2 size={80} className="text-green-500 mb-4" />
              <p className="text-green-500 font-display text-2xl uppercase tracking-widest">Panchita</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-12 text-center max-w-xs z-[110]">
        <p className="text-sm text-neutral-400 font-light leading-relaxed mb-8">
          {status === 'scanning' 
            ? 'Apunta tu cámara a cualquier código QR para entrar al menú demo.' 
            : 'Redirigiendo a la experiencia de Panchita...'}
        </p>

        {/* Botones Manuales de Respaldo */}
        <div className="flex flex-col gap-3 relative">
          <p className="text-[10px] uppercase tracking-widest text-neutral-600 mb-2">Selección Manual</p>
          <div className="flex gap-4 justify-center pointer-events-auto">
            <button 
              onClick={() => onScan('panchita')}
              className="px-6 py-4 bg-white text-black text-xs uppercase tracking-widest font-bold rounded-xl active:scale-95 shadow-xl transition-all hover:bg-neutral-200"
            >
              Panchita
            </button>
            <button 
              onClick={() => onScan('cusicusa')}
              className="px-6 py-4 bg-neutral-800 text-white text-xs uppercase tracking-widest font-bold rounded-xl active:scale-95 shadow-xl transition-all hover:bg-neutral-700 border border-white/10"
            >
              Cusi Cusa
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scan-line { 0% { top: 0; } 100% { top: 100%; } }
        .animate-scan-line { animation: scan-line 3s linear infinite; }
      `}</style>
    </div>
  );
};

export default Scanner;
