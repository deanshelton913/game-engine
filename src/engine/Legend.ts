import { LegendItem } from './LegendItem';
import { Velocity } from './Velocity';

interface Dictionary<T> {
  [Key: number]: T;
}

export const Legend: Dictionary<LegendItem> = {
  0: new LegendItem({ id: 0, colour: '#333', solid: false }),
  1: new LegendItem({ id: 1, colour: '#888', solid: false}),
  2: new LegendItem({ id: 2, colour: '#555', solid: true, bounce: 0.35}),
  3: new LegendItem({ 
    id: 3,
    colour: 'rgba(121, 220, 242, 0.4)', 
    friction: new Velocity(0.9, 0.9), 
    gravity: new Velocity(0, 0.1), 
    jump: true, 
    fore: true
  }),
  4: new LegendItem({ id: 4, colour: '#777', jump: true}),
  5: new LegendItem({ id: 5, colour: '#E373FA', solid: true, bounce: 1.1}),
  6: new LegendItem({ id: 6, colour: '#666', solid: true, bounce: 0}),
  7: new LegendItem({ id: 7, colour: '#73C6FA', solid: false, script: 'change_colour'}),
  8: new LegendItem({ id: 8, colour: '#FADF73', solid: false, script: 'next_level'}),
  9: new LegendItem({ id: 9, colour: '#C93232', solid: false, script: 'death'}),
  10: new LegendItem({ id: 10, colour: '#555', solid: true}),
  11: new LegendItem({ id: 11, colour: '#0FF', solid: false, script: 'unlock'})
};
