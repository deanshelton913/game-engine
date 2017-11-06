import { Velocity } from './Velocity';
export class LegendItem {
  id: number;
  colour: string;
  solid: boolean;
  bounce: number;
  jump: boolean;
  friction: Velocity;
  gravity: Velocity;
  fore: boolean;
  script?: string;

  constructor(config: {
    id: number,
    colour?: string;
    solid?: boolean;
    bounce?: number;
    jump?: boolean;
    friction?: Velocity;
    gravity?: Velocity;
    fore?: boolean;
    script?: string,
  }) {
    this.id = config.id;
    this.colour = config.colour || '#333';
    this.solid = config.solid || false;
    this.bounce = config.bounce || 0;
    this.jump = config.jump || false;
    this.friction = config.friction || new Velocity(0, 0);
    this.gravity = config.gravity || new Velocity(0, 0);
    this.fore = config.fore || false;
    this.script = config.script;
  } 
}
