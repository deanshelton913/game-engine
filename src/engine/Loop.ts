
import { Engine } from './Engine';
import { Player } from './Player';
import { Coordinate } from './Coordinate';
import * as map from './maps/level.1.map.js';

const alertErrors = false;
const logInfo = false;
const tileSize = 16;
const limitViewport = false;
const jumpSwitch = 0;
const viewport = new Size(200, 200);
const camera = new Coordinate(0, 0);
const key = { left: false, right: false, up: false };
const player = new Player();
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');  

let game = new Engine({
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
game.setViewport(400, 400);
game.loadMap(map);
game.limitViewport = true;
  
export class Loop {
  constructor() {
    
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    game.update();
    game.draw(ctx);
    
    window.requestAnimationFrame(Loop);
  }
  
}
  
window.gameLoop = new Loop();