
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
      className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-neutral-900 cursor-pointer"
    >
      <img 
        src={dish.thumbnail} 
        alt={dish.title}
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>
      
      {/* Content */}
      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] font-medium opacity-70 mb-1">{dish.category}</p>
            <h3 className="text-xl font-display leading-tight">{dish.title}</h3>
            <p className="text-lg mt-1 font-light opacity-90">{dish.price}</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-full border border-white/20 transition-transform group-hover:scale-110 group-hover:bg-white group-hover:text-black">
            <Play size={20} fill="currentColor" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DishCard;
