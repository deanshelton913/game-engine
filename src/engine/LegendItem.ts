import { Velocity } from './Velocity';

class LegendConfig {
  constructor(
    public id: number,
    public bounce: number = 0,
    public solid: boolean = false,
    public colour: string = '#333',
    public jump: boolean = false,
    public friction: Velocity = new Velocity(0, 0),
    public gravity: Velocity = new Velocity(0, 0),
    public fore: boolean = false,
    public script?: string
  ) { }
}

export class LegendItem {
  id: number;
  bounce: number;
  solid: boolean;
  colour: string;
  jump: boolean;
  friction: Velocity;
  gravity: Velocity;
  fore: boolean;
  script?: string;

  constructor(public config: LegendConfig) {
    this.id = config.id;
    this.bounce = config.bounce;
    this.solid = config.solid;
    this.colour = config.colour;
    this.jump = config.jump;
    this.friction = config.friction;
    this.gravity = config.gravity;
    this.fore = config.fore;
    this.script = config.script;
  }
}
