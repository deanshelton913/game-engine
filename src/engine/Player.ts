
import { Coordinate } from './Coordinate';
import { Velocity } from './Velocity';

export class Player {
  constructor(
    public color: string,
    public location: Coordinate,
    public velocity: Velocity,
    public canJump: boolean,
    public onFloor: boolean
  ) { }
}
