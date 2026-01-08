
import React from 'react';
import { Dish } from '../types';
import { Play } from 'lucide-react';

interface DishCardProps {
  dish: Dish;
  onClick: () => void;
}

const DishCard: React.FC<DishCardProps> = ({ dish, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-neutral-900 cursor-pointer shadow-lg"
    >
      {/* Usamos object-cover y object-center para que las miniaturas horizontales de YouTube se vean bien */}
      <img 
        src={dish.thumbnail} 
        alt={dish.title}
        className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
      />
      
      {/* Gradient Overlay - Más profundo para mejor legibilidad de textos blancos */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-90 group-hover:opacity-70 transition-opacity"></div>
      
      {/* Content */}
      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        <div className="flex items-end justify-between">
          <div className="pr-4">
            <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-white/60 mb-1">{dish.category}</p>
            <h3 className="text-xl font-display leading-tight text-white drop-shadow-md">{dish.title}</h3>
            <p className="text-lg mt-1 font-light text-white/90 italic">{dish.price}</p>
          </div>
          
          <div className="flex-shrink-0 bg-white/10 backdrop-blur-xl p-3.5 rounded-full border border-white/20 text-white transition-all group-hover:scale-110 group-hover:bg-white group-hover:text-black shadow-xl">
            <Play size={20} fill="currentColor" />
          </div>
        </div>
      </div>

      {/* Hover State: "Ver Video" label */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
        <span className="text-[8px] uppercase tracking-[0.2em] font-bold text-white">Ver Video</span>
      </div>
    </div>
  );
};

export default DishCard;
