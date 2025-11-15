// src/lib/types/wish.types.ts

export interface Slide {
  id: string;
  frameShape: string;
  imageUrl: string;
  imageFile?: File;
  slideName: string;
  transition: string;
  order: number;
}

export interface WishFormData {
  // Step 1
  recipientName: string;
  
  // Step 2
  gradient: string;
  
  // Step 3
  slides: Slide[];
  
  // Step 4
  noteMessage: string;
  noteAuthor: string;
  useCustomAuthor: boolean;
  
  // Step 5
  musicType: 'preset' | 'custom';
  musicPreset?: string;
  musicFile?: File;
  
  // Step 6
  privacy: 'public' | 'private';
  password?: string;
  
  // Step 7
  customUrl: string;
  birthdayDate: string;
  birthdayTime: string;
}

export interface Comment {
  id: string;
  wishId: string;
  userId?: string;
  username: string;
  message: string;
  createdAt: string;
}

export interface FrameShape {
  id: string;
  name: string;
  svgPath: string;
  aspectRatio: string;
}

export interface Transition {
  id: string;
  name: string;
  cssClass: string;
  duration: number;
}

export interface Gradient {
  id: string;
  name: string;
  cssClass: string;
  preview: string;
}

export interface MusicPreset {
  id: string;
  name: string;
  duration: string;
  genre: string;
  url: string;
}