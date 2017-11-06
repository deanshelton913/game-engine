
import { Coordinate } from './Coordinate';
import { Velocity } from './Velocity';

export class Player {
  color: string;
  location: Coordinate;
  velocity: Velocity;
  canJump: boolean;
  onFloor: boolean;
}
