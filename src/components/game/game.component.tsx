import './game.css';
import * as React from 'react';

interface Props {
  isCool?: string;
}

export const Game = (props: Props) => {
    return (
    <div className="game-component">
      <canvas id="canvas"/>
        <p>
          Use the left, right and up arrow keys to move.
        </p>
        <p className="info">
          I am info!
        </p>
        <br/>
        <a target="_blank" href="https://github.com/dissimulate/Clarity">View on GitHub</a>

    </div>);
};