
import React from 'react';
import { OrderItem } from '../types';
import { X, Minus, Plus, ShoppingBag, Send } from 'lucide-react';

interface OrderPanelProps {
  items: OrderItem[];
  onClose: () => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onConfirm: () => void;
}

const OrderPanel: React.FC<OrderPanelProps> = ({ items, onClose, onUpdateQuantity, onRemove, onConfirm }) => {
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  
  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Panel */}
      <div className="relative w-full max-w-md bg-[#f8f5f0] h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-6 border-b border-neutral-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <ShoppingBag size={20} className="text-neutral-900" />
            <h2 className="text-xl font-display text-neutral-900">Tu Comanda</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
              <ShoppingBag size={48} className="mb-4" />
              <p className="font-display text-lg">Tu comanda está vacía</p>
              <p className="text-xs uppercase tracking-widest mt-2">Añade platos desde el menú</p>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex gap-4 items-start bg-white p-4 rounded-xl shadow-sm border border-neutral-100">
                <img src={item.thumbnail} className="w-16 h-16 rounded-lg object-cover" alt={item.title} />
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-neutral-900 leading-tight mb-1">{item.title}</h4>
                  <p className="text-sm font-display text-amber-900 mb-3">{item.price}</p>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center bg-neutral-100 rounded-full px-2 py-1">
                      <button 
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="p-1 hover:text-amber-800 transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="p-1 hover:text-amber-800 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button 
                      onClick={() => onRemove(item.id)}
                      className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 hover:text-red-500"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-8 bg-white border-t border-neutral-200">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs uppercase tracking-[0.2em] font-bold text-neutral-400">Total Items</span>
              <span className="text-xl font-display">{totalItems} platos</span>
            </div>
            <button 
              onClick={onConfirm}
              className="w-full bg-neutral-900 text-white py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-amber-900 transition-all active:scale-95 shadow-xl"
            >
              <Send size={18} />
              <span className="text-xs uppercase tracking-[0.3em] font-bold">Enviar Comanda</span>
            </button>
            <p className="text-[9px] text-center text-neutral-400 uppercase tracking-widest mt-4">El pedido se enviará directamente a cocina</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderPanel;
