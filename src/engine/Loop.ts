
import { Engine, EngineConfiguration } from './Engine';
import { Player } from './Player';
import { Coordinate } from './Coordinate';
import { Size } from './Size';
import { Velocity } from './Velocity';
import { levelOne } from './maps/level.1.map.js';

const playerConfig = {
  color: '#fff',
  location: new Coordinate(2, 2),
  velocity: new Velocity(0, 0),
  canJump: false,
  onFloor: false,
}

const player = new Player(
  playerConfig.color,
  playerConfig.location,
  playerConfig.velocity,
  playerConfig.canJump,
  playerConfig.onFloor
);

const engineConfigParams = {
  alertErrors: false,
  logInfo: false,
  tileSize: 16,
  limitViewport: false,
  jumpSwitch: 0,
  viewport: new Size(200, 200),
  camera: new Coordinate(0, 0),
  key: { left: false, right: false, up: false },
  player
}

const engineConfig = new EngineConfiguration(
    engineConfigParams.alertErrors,
    engineConfigParams.logInfo,
    engineConfigParams.tileSize,
    engineConfigParams.limitViewport,
    engineConfigParams.jumpSwitch,
    engineConfigParams.viewport,
    engineConfigParams.camera,
    engineConfigParams.key,
    engineConfigParams.player
  );
const engine = new Engine(engineConfig);

engine.setViewport(new Size(400, 400));
engine.config.limitViewport = true;
engine.loadMap(levelOne);
  
const loop = () => {
  const canvas = <HTMLCanvasElement> document.getElementById('canvas');
  if(!canvas){ throw 'ERROR. NO CANVAS.' }
  const ctx = canvas.getContext('2d'); 
  if(!ctx){ throw 'ERROR. CAN NOT GET CONTEXT.' }
  
  ctx.fillStyle = '#333';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  engine.update();
  engine.draw(ctx);
}

window.requestAnimationFrame(loop);