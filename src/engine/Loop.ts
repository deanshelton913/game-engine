
import { Engine } from './Engine';
import { Player } from './Player';
import { Coordinate } from './Coordinate';
import { Size } from './Size';
import {  } from './MapConfiguration';
import { levelOne } from './maps/level.1.map.js';

const alertErrors = false;
const logInfo = false;
const tileSize = 16;
const limitViewport = false;
const jumpSwitch = 0;
const viewport = new Size(200, 200);
const camera = new Coordinate(0, 0);
const key = { left: false, right: false, up: false };
const player = new Player();
const canvas = <HTMLCanvasElement> document.getElementById('canvas');
if(!canvas){ throw 'ERROR. NO CANVAS.' }
const ctx = canvas.getContext('2d');  
if(!ctx){ throw 'ERROR. CAN NOT GET CONTEXT.' }

let engine = new Engine({
    alertErrors,
    logInfo,
    tileSize,
    limitViewport,
    jumpSwitch,
    viewport,
    camera,
    key,
    player
  }
);

engine.setViewport(new Size(400, 400));
engine.config.limitViewport = true;
engine.loadMap(levelOne)
  
export class Loop {
  constructor() {
    
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    engine.update();
    engine.draw(ctx);
    
    window.requestAnimationFrame(Loop);
  }
  
}
  
window.gameLoop = new Loop();