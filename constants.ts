
import { Dish, Restaurant } from './types';

export const RESTAURANTS: Record<string, Restaurant> = {
  'panchita': {
    id: 'panchita',
    name: 'Panchita',
    logo: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=200&h=200&fit=crop',
    playlistId: 'PLx0sYbCqOb8TBPRjGUWpESWmuxkL9LQWj',
    description: 'Sazón, corazón y vida. La cocina de nuestra tierra.'
  },
  'cusicusa': {
    id: 'cusicusa',
    name: 'Cusi Cusa',
    logo: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=200&h=200&fit=crop',
    playlistId: 'PLx0sYbCqOb8TBPRjGUWpESWmuxkL9LQWj',
    description: 'The art of traditional fusion.'
  }
};

export const MOCK_DISHES_MAP: Record<string, Dish[]> = {
  'panchita': [
    {
      id: 'p1',
      title: 'Empanada de pastel de choclo',
      description: 'Rellena de choclitos tiernos y carne guisada a fuego lento.',
      price: 'S/ 18.00',
      videoId: 'i_vfh_kB7i4',
      thumbnail: 'https://img.youtube.com/vi/i_vfh_kB7i4/hqdefault.jpg',
      category: 'Entradas'
    },
    {
      id: 'p2',
      title: 'Empanada de rocoto relleno',
      description: 'Al estilo Panchita, rellena de carne guisada a fuego lento, queso y rocoto.',
      price: 'S/ 18.00',
      videoId: 'W9dvAgLyqAU',
      thumbnail: 'https://img.youtube.com/vi/W9dvAgLyqAU/hqdefault.jpg',
      category: 'Entradas'
    },
    {
      id: 'p3',
      title: 'Tamalito verde',
      description: 'Con jugo de seco y sarza criolla.',
      price: 'S/ 21.00',
      videoId: '7_zT6_yEw4s',
      thumbnail: 'https://img.youtube.com/vi/7_zT6_yEw4s/hqdefault.jpg',
      category: 'Entradas'
    },
    {
      id: 'p4',
      title: 'Papa a la huancaína clásica',
      description: 'Con su huevo y aceituna. *Nuestros precios están expresados en...',
      price: 'S/ 32.00',
      videoId: 'vI_U_tGsmS0',
      thumbnail: 'https://img.youtube.com/vi/vI_U_tGsmS0/hqdefault.jpg',
      category: 'Entradas'
    },
    {
      id: 'p5',
      title: 'Papa rellena',
      description: 'Una papa rellena acompañada de crema de rocoto y sarza criolla.',
      price: 'S/ 32.00',
      videoId: 'i_vfh_kB7i4',
      thumbnail: 'https://img.youtube.com/vi/i_vfh_kB7i4/hqdefault.jpg',
      category: 'Entradas'
    },
    {
      id: 'p6',
      title: 'Boliyucas de queso',
      description: 'Masa de yuca y quesos, acompañadas de salsas huancaína y ocopa.',
      price: 'S/ 32.00',
      videoId: 'W9dvAgLyqAU',
      thumbnail: 'https://img.youtube.com/vi/W9dvAgLyqAU/hqdefault.jpg',
      category: 'Entradas'
    }
  ],
  'cusicusa': [
    {
      id: 'c1',
      title: 'Wild Mushroom Risotto',
      description: 'Arborio rice with porcini and shiitake.',
      price: '$24',
      videoId: '7_zT6_yEw4s',
      thumbnail: 'https://img.youtube.com/vi/7_zT6_yEw4s/hqdefault.jpg',
      category: 'Mains'
    }
  ]
};

export const MOCK_RESTAURANT = RESTAURANTS['panchita'];
export const MOCK_DISHES = MOCK_DISHES_MAP['panchita'];
