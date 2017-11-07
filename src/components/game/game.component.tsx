import './game.css';
import * as React from 'react';

import { Engine, EngineConfiguration } from '../../engine/Engine';
import { Player } from '../../engine/Player';
import { Coordinate } from '../../engine/Coordinate';
import { Size } from '../../engine/Size';
import { Velocity } from '../../engine/Velocity';
import { levelOne } from '../../engine/maps/level.1.map.js';

// const loop = () => {
//   const canvas = <HTMLCanvasElement> document.getElementById('canvas');
//   if (!canvas) { throw 'ERROR. NO CANVAS.'; }
//   const ctx = canvas.getContext('2d'); 
//   if (!ctx) { throw 'ERROR. CAN NOT GET CONTEXT.'; }
  
//   ctx.fillStyle = '#333';
//   ctx.fillRect(0, 0, canvas.width, canvas.height);
  
//   engine.update();
//   engine.draw(ctx);
// };

// console.log('I AM LOOP');
// window.requestAnimationFrame(loop);

export class Game extends React.Component {
  canvas: HTMLCanvasElement;
  engine: Engine;
  loop = () => {
    if (this.canvas) {
      const ctx = this.canvas.getContext('2d'); 
      if (!ctx) { throw 'ERROR. CAN NOT GET CONTEXT.'; }
         
      ctx.fillStyle = '#333';
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
         
      this.engine.update();
      this.engine.draw(ctx);
    }
  }
  
  componentDidMount() {
    const playerConfig = {
      color: '#fff',
      location: new Coordinate(2, 2),
      velocity: new Velocity(0, 0),
      canJump: false,
      onFloor: false,
    };
    
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
    };
    
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
    
    this.engine = new Engine(engineConfig);
    
    this.engine.setViewport(new Size(400, 400));
    this.engine.config.limitViewport = true;
    this.engine.loadMap(levelOne);
    
    window.requestAnimationFrame(this.loop);
  }
    
  render() {
    return (
      <div className="game-component">
        <canvas id="canvas" ref={(x: HTMLCanvasElement ) => this.canvas = x} />
          <p>
            Use the left, right and up arrow keys to move.
          </p>
          <p className="info">
            I am info!
          </p>
          <br/>
          <a target="_blank" href="https://github.com/dissimulate/Clarity">View on GitHub</a>

      </div>);
  }
}