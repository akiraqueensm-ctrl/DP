
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
      // We purely rely on React state for transitions. 
      // Removing window.history.pushState as it causes SecurityErrors and Circular Structure errors 
      // in proxied/blob environments.
      setRestaurant(targetRestaurant);
      setDishes(MOCK_DISHES_MAP[rId] || []);
      setIsScanning(false);
      setSelectedDish(null);
    }
  }, []);

  if (!restaurant) {
    return (
      <div className="bg-black min-h-screen">
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
    <div className="min-h-screen pb-24 animate-in fade-in duration-700 bg-black text-white">
      <header className="px-6 pt-12 pb-8 flex flex-col items-center text-center">
        <div className="w-24 h-24 bg-neutral-800 rounded-full mb-6 overflow-hidden border border-white/10 shadow-2xl ring-4 ring-white/5">
          <img src={restaurant.logo} alt={restaurant.name} className="w-full h-full object-cover" />
        </div>
        <h1 className="text-4xl font-display mb-2">{restaurant.name}</h1>
        <p className="text-sm font-light text-neutral-400 uppercase tracking-widest">{restaurant.description}</p>
      </header>

      <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/5 py-4 mb-8">
        <div className="flex gap-4 overflow-x-auto px-6 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-6 py-2 rounded-full text-xs uppercase tracking-widest font-medium transition-all ${
                activeCategory === cat 
                ? 'bg-white text-black' 
                : 'bg-neutral-900 text-neutral-400 hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <main className="px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {filteredDishes.map(dish => (
            <DishCard 
              key={dish.id} 
              dish={dish} 
              onClick={() => setSelectedDish(dish)} 
            />
          ))}
        </div>
      </main>

      <footer className="mt-24 px-6 py-12 border-t border-white/5 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <ChefHat size={20} className="text-neutral-500" />
          <span className="text-xs uppercase tracking-[0.3em] font-medium text-neutral-500">DishPlay</span>
        </div>
        <p className="text-[10px] uppercase tracking-widest text-neutral-600">Video First Dining Experience</p>
      </footer>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-neutral-900/90 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-full shadow-2xl z-40">
        <button 
          onClick={() => setIsScanning(true)}
          className="flex items-center gap-2 px-3 border-r border-white/10 pr-4 text-white active:scale-95 transition-transform"
        >
          <Scan size={16} />
          <span className="text-xs uppercase tracking-widest font-medium">Nuevo Scan</span>
        </button>
        <button className="flex items-center gap-2 pl-1 text-white opacity-60">
          <Share2 size={16} />
          <span className="text-xs uppercase tracking-widest font-medium">Compartir</span>
        </button>
      </div>

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
