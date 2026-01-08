
import React from 'react';
import { Dish } from '../types';
import { Plus, Play } from 'lucide-react';

interface DishCardProps {
  dish: Dish;
  onVideoClick: () => void;
  onAddToOrder: (e: React.MouseEvent) => void;
}

const DishCard: React.FC<DishCardProps> = ({ dish, onVideoClick, onAddToOrder }) => {
  return (
    <div 
      className="group flex bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all border border-neutral-100 h-full min-h-[160px]"
    >
      {/* Left: Text Content - Clic abre video */}
      <div 
        onClick={onVideoClick}
        className="flex-1 p-5 flex flex-col justify-between cursor-pointer"
      >
        <div>
          <h3 className="text-[17px] font-bold font-display text-neutral-900 leading-snug mb-2 group-hover:text-amber-800 transition-colors">
            {dish.title}
          </h3>
          <p className="text-[13px] text-neutral-600 line-clamp-2 leading-relaxed font-light">
            {dish.description}
          </p>
          <p className="text-[11px] text-neutral-400 mt-1">...</p>
        </div>
        
        <div className="mt-4">
          <p className="text-[15px] font-medium text-neutral-900 font-display">
            {dish.price}
          </p>
        </div>
      </div>

      {/* Right: Image & Add Button */}
      <div className="relative w-40 sm:w-48 overflow-hidden">
        <div onClick={onVideoClick} className="h-full w-full cursor-pointer relative">
          <img 
            src={dish.thumbnail} 
            alt={dish.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
             <Play size={24} className="text-white fill-white" />
          </div>
        </div>
        
        {/* Plus Icon Overlay - Clic añade a comanda */}
        <button 
          onClick={onAddToOrder}
          title="Añadir al pedido"
          className="absolute bottom-3 right-3 bg-neutral-900 backdrop-blur-sm p-2 rounded-full border border-white/20 text-white transition-all hover:bg-amber-900 hover:scale-110 active:scale-90 shadow-lg pointer-events-auto"
        >
          <Plus size={20} />
        </button>
      </div>
    </div>
  );
};

export default DishCard;
