// src/lib/constants/music.ts
import { MusicPreset } from '../types/wish.types';

export const MUSIC_PRESETS: MusicPreset[] = [
  {
    id: 'happy-classic',
    name: 'Happy Birthday Classic',
    duration: '2:30',
    genre: 'Traditional',
    url: '/music/happy-classic.mp3'
  },
  {
    id: 'jazz-celebration',
    name: 'Jazz Celebration',
    duration: '3:15',
    genre: 'Jazz',
    url: '/music/jazz-celebration.mp3'
  },
  {
    id: 'upbeat-party',
    name: 'Upbeat Party',
    duration: '2:45',
    genre: 'Pop',
    url: '/music/upbeat-party.mp3'
  },
  {
    id: 'gentle-wishes',
    name: 'Gentle Wishes',
    duration: '3:00',
    genre: 'Ambient',
    url: '/music/gentle-wishes.mp3'
  },
  {
    id: 'dance-vibes',
    name: 'Dance Vibes',
    duration: '2:50',
    genre: 'Dance',
    url: '/music/dance-vibes.mp3'
  },
  {
    id: 'acoustic-dreams',
    name: 'Acoustic Dreams',
    duration: '3:20',
    genre: 'Acoustic',
    url: '/music/acoustic-dreams.mp3'
  },
  {
    id: 'electronic-burst',
    name: 'Electronic Burst',
    duration: '2:40',
    genre: 'Electronic',
    url: '/music/electronic-burst.mp3'
  },
  {
    id: 'orchestral-grand',
    name: 'Orchestral Grand',
    duration: '3:30',
    genre: 'Orchestral',
    url: '/music/orchestral-grand.mp3'
  }
];

export const MAX_CUSTOM_MUSIC_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_MUSIC_FORMATS = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg'];