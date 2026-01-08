
export interface Dish {
  id: string;
  title: string;
  description: string;
  price: string;
  videoId: string;
  thumbnail: string;
  category: string;
}

export interface OrderItem extends Dish {
  quantity: number;
}

export interface Restaurant {
  id: string;
  name: string;
  logo: string;
  playlistId: string;
  description: string;
}

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}
