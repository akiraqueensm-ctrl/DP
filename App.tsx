
import React, { useState, useEffect, useCallback } from 'react';
import { RESTAURANTS, MOCK_DISHES_MAP } from './constants';
import { Dish, Restaurant } from './types';
import DishCard from './components/DishCard';
import CustomPlayer from './components/CustomPlayer';
import Landing from './components/Landing';
import Scanner from './components/Scanner';
import { ChefHat, Share2, Scan } from 'lucide-react';

const App: React.FC = () => {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const rId = params.get('r') || params.get('restaurantId');
    if (rId && RESTAURANTS[rId]) {
      setRestaurant(RESTAURANTS[rId]);
      setDishes(MOCK_DISHES_MAP[rId] || []);
    }
  }, []);

  const handleScanSuccess = useCallback((rId: string) => {
    const targetRestaurant = RESTAURANTS[rId];
    if (targetRestaurant) {
      setRestaurant(targetRestaurant);
      setDishes(MOCK_DISHES_MAP[rId] || []);
      setIsScanning(false);
      setSelectedDish(null);
    }
  }, []);

  if (!restaurant) {
    return (
      <div className="bg-[#f8f5f0] min-h-screen">
        {isScanning ? (
          <Scanner onScan={handleScanSuccess} onClose={() => setIsScanning(false)} />
        ) : (
          <Landing onStartScan={() => setIsScanning(true)} />
        )}
      </div>
    );
  }

  const categories = ['All', ...Array.from(new Set(dishes.map(d => d.category)))];
  const filteredDishes = activeCategory === 'All' 
    ? dishes 
    : dishes.filter(d => d.category === activeCategory);

  return (
    <div className="min-h-screen pb-24 animate-in fade-in duration-700 bg-[#f8f5f0] text-neutral-900">
      {/* Header Estilo Panchita */}
      <header className="px-6 pt-16 pb-8 flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-white rounded-full mb-6 overflow-hidden border border-neutral-200 shadow-sm">
          <img src={restaurant.logo} alt={restaurant.name} className="w-full h-full object-cover" />
        </div>
        <h1 className="text-4xl font-display mb-2 text-neutral-900">{restaurant.name}</h1>
        <p className="text-[11px] font-medium text-neutral-500 uppercase tracking-[0.3em] max-w-xs">{restaurant.description}</p>
        <div className="h-[1px] w-12 bg-neutral-300 mt-6"></div>
      </header>

      {/* Categorías Minimalistas */}
      <div className="sticky top-0 z-40 bg-[#f8f5f0]/90 backdrop-blur-xl border-b border-neutral-200/50 py-4 mb-10">
        <div className="flex gap-4 overflow-x-auto px-6 no-scrollbar justify-center md:justify-center">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${
                activeCategory === cat 
                ? 'bg-neutral-900 text-white shadow-md' 
                : 'bg-white/50 text-neutral-500 hover:text-neutral-900 border border-neutral-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Platos (3 columnas en desktop como en la imagen) */}
      <main className="px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {filteredDishes.map(dish => (
            <DishCard 
              key={dish.id} 
              dish={dish} 
              onClick={() => setSelectedDish(dish)} 
            />
          ))}
        </div>
      </main>

      {/* Footer elegante */}
      <footer className="mt-24 px-6 py-12 border-t border-neutral-200 text-center bg-white/30">
        <div className="flex items-center justify-center gap-2 mb-4">
          <ChefHat size={18} className="text-neutral-400" />
          <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-neutral-400">DishPlay</span>
        </div>
        <p className="text-[9px] uppercase tracking-widest text-neutral-400">Menú Digital Cinematográfico</p>
      </footer>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-neutral-900 text-white px-6 py-3.5 rounded-full shadow-2xl z-40 border border-white/10 active:scale-95 transition-transform">
        <button 
          onClick={() => setIsScanning(true)}
          className="flex items-center gap-2.5 px-2 border-r border-white/20 pr-5"
        >
          <Scan size={16} />
          <span className="text-[10px] uppercase tracking-widest font-bold">Nuevo Scan</span>
        </button>
        <button className="flex items-center gap-2 pl-1 opacity-80">
          <Share2 size={16} />
        </button>
      </div>

      {/* Video Player (Se mantiene oscuro para contraste) */}
      {selectedDish && (
        <CustomPlayer 
          videoId={selectedDish.videoId} 
          title={selectedDish.title}
          onClose={() => setSelectedDish(null)} 
        />
      )}
    </div>
  );
};

export default App;
