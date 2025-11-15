// src/lib/constants/frameShapes.ts
import { FrameShape } from '../types/wish.types';

export const FRAME_SHAPES: FrameShape[] = [
  {
    id: 'rectangle',
    name: 'Rectangle',
    svgPath: 'M0,0 L100,0 L100,100 L0,100 Z',
    aspectRatio: '16/9'
  },
  {
    id: 'circle',
    name: 'Circle',
    svgPath: 'M50,50 m-50,0 a50,50 0 1,0 100,0 a50,50 0 1,0 -100,0',
    aspectRatio: '1/1'
  },
  {
    id: 'rounded',
    name: 'Rounded Square',
    svgPath: 'M20,0 L80,0 Q100,0 100,20 L100,80 Q100,100 80,100 L20,100 Q0,100 0,80 L0,20 Q0,0 20,0 Z',
    aspectRatio: '1/1'
  },
  {
    id: 'heart',
    name: 'Heart',
    svgPath: 'M50,90 C20,60 0,40 0,25 C0,12 10,0 25,0 C35,0 45,5 50,15 C55,5 65,0 75,0 C90,0 100,12 100,25 C100,40 80,60 50,90 Z',
    aspectRatio: '1/1'
  },
  {
    id: 'star',
    name: 'Star',
    svgPath: 'M50,0 L61,35 L98,35 L68,57 L79,91 L50,70 L21,91 L32,57 L2,35 L39,35 Z',
    aspectRatio: '1/1'
  },
  {
    id: 'hexagon',
    name: 'Hexagon',
    svgPath: 'M25,0 L75,0 L100,43 L75,86 L25,86 L0,43 Z',
    aspectRatio: '4/3'
  },
  {
    id: 'diamond',
    name: 'Diamond',
    svgPath: 'M50,0 L100,50 L50,100 L0,50 Z',
    aspectRatio: '1/1'
  },
  {
    id: 'cloud',
    name: 'Cloud',
    svgPath: 'M25,50 Q25,25 45,25 Q50,10 65,10 Q85,10 90,25 Q100,30 100,45 Q100,60 85,65 L20,65 Q0,60 0,45 Q0,30 15,25 Q20,30 25,50 Z',
    aspectRatio: '16/9'
  },
  {
    id: 'polaroid',
    name: 'Polaroid',
    svgPath: 'M10,0 L90,0 Q100,0 100,10 L100,75 L100,90 Q100,100 90,100 L10,100 Q0,100 0,90 L0,75 L0,10 Q0,0 10,0 Z',
    aspectRatio: '4/5'
  },
  {
    id: 'wave',
    name: 'Wave',
    svgPath: 'M0,30 Q25,10 50,30 T100,30 L100,100 L0,100 Z',
    aspectRatio: '16/9'
  }
];