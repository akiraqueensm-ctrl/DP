
import { Dish, Restaurant } from './types';

export const RESTAURANTS: Record<string, Restaurant> = {
  'panchita': {
    id: 'panchita',
    name: 'Panchita',
    logo: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=200&h=200&fit=crop',
    playlistId: 'PLx0sYbCqOb8TBPRjGUWpESWmuxkL9LQWj',
    description: 'Authentic flavors, modern presentation.'
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
      title: 'Signature Ribeye',
      description: 'Dry-aged 30 days, served with truffle butter.',
      price: '$42',
      videoId: 'i_vfh_kB7i4',
      thumbnail: 'https://images.unsplash.com/photo-1546241072-48010ad28c2c?w=600&h=800&fit=crop',
      category: 'Mains'
    },
    {
      id: 'p2',
      title: 'Atlantic Scallops',
      description: 'Pan-seared with cauliflower purée.',
      price: '$28',
      videoId: 'W9dvAgLyqAU',
      thumbnail: 'https://images.unsplash.com/photo-1533777324545-e0162727fc90?w=600&h=800&fit=crop',
      category: 'Starters'
    }
  ],
  'cusicusa': [
    {
      id: 'c1',
      title: 'Wild Mushroom Risotto',
      description: 'Arborio rice with porcini and shiitake.',
      price: '$24',
      videoId: '7_zT6_yEw4s',
      thumbnail: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600&h=800&fit=crop',
      category: 'Mains'
    },
    {
      id: 'c2',
      title: 'Dark Chocolate Fondant',
      description: 'Molten center, vanilla bean gelato.',
      price: '$16',
      videoId: 'vI_U_tGsmS0',
      thumbnail: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&h=800&fit=crop',
      category: 'Desserts'
    }
  ]
};

// Default export for backward compatibility if needed
export const MOCK_RESTAURANT = RESTAURANTS['panchita'];
export const MOCK_DISHES = MOCK_DISHES_MAP['panchita'];
