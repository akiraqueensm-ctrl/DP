
import React from 'react';
import { Dish } from '../types';
import { Plus } from 'lucide-react';

interface DishCardProps {
  dish: Dish;
  onClick: () => void;
}

const DishCard: React.FC<DishCardProps> = ({ dish, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="group flex bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer border border-neutral-100 h-full min-h-[160px]"
    >
      {/* Left: Text Content */}
      <div className="flex-1 p-5 flex flex-col justify-between">
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

      {/* Right: Image */}
      <div className="relative w-40 sm:w-48 overflow-hidden">
        <img 
          src={dish.thumbnail} 
          alt={dish.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Play/Plus Icon Overlay */}
        <div className="absolute bottom-3 right-3 bg-neutral-900/40 backdrop-blur-sm p-1.5 rounded-full border border-white/20 text-white transition-all group-hover:bg-amber-900 group-hover:scale-110">
          <Plus size={18} />
        </div>
      </div>
    </div>
  );
};

export default DishCard;
