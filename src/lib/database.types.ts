// Database schema types
export interface User {
  id: string;
  email: string;
  username: string;
  region: string;
  created_at: string;
  updated_at: string;
  is_premium: boolean;
  google_auth_enabled: boolean;
}

export interface Wish {
  id: string;
  user_id: string;
  recipient_name: string;
  template_id: string;
  status: 'draft' | 'scheduled' | 'active' | 'expired';
  birthday_date: string;
  birthday_time: string;
  privacy: 'public' | 'private';
  password_hash?: string;
  custom_url?: string;
  music_id: string;
  created_at: string;
  updated_at: string;
  views_count: number;
}

export interface WishImage {
  id: string;
  wish_id: string;
  image_url: string;
  order_index: number;
  created_at: string;
}

export interface Template {
  id: string;
  name: string;
  max_images: number;
  is_premium: boolean;
  thumbnail_url: string;
}

export interface Music {
  id: string;
  name: string;
  duration: string;
  genre: string;
  is_premium: boolean;
  file_url: string;
}