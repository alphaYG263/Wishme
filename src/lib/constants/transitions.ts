// src/lib/constants/transitions.ts
import { Transition } from '../types/wish.types';

export const TRANSITIONS: Transition[] = [
  {
    id: 'fade',
    name: 'Fade',
    cssClass: 'transition-fade',
    duration: 1000
  },
  {
    id: 'slide-left',
    name: 'Slide Left',
    cssClass: 'transition-slide-left',
    duration: 800
  },
  {
    id: 'slide-right',
    name: 'Slide Right',
    cssClass: 'transition-slide-right',
    duration: 800
  },
  {
    id: 'slide-up',
    name: 'Slide Up',
    cssClass: 'transition-slide-up',
    duration: 800
  },
  {
    id: 'slide-down',
    name: 'Slide Down',
    cssClass: 'transition-slide-down',
    duration: 800
  },
  {
    id: 'zoom-in',
    name: 'Zoom In',
    cssClass: 'transition-zoom-in',
    duration: 1000
  },
  {
    id: 'zoom-out',
    name: 'Zoom Out',
    cssClass: 'transition-zoom-out',
    duration: 1000
  },
  {
    id: 'rotate',
    name: 'Rotate',
    cssClass: 'transition-rotate',
    duration: 1200
  },
  {
    id: 'flip',
    name: 'Flip',
    cssClass: 'transition-flip',
    duration: 1000
  },
  {
    id: 'blur',
    name: 'Blur Fade',
    cssClass: 'transition-blur',
    duration: 1000
  }
];