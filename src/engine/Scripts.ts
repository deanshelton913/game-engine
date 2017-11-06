export enum Scripts {
  /* you can just use "this" instead of your engine variable ("game"), but Codepen doesn't like it */
  CHANGE_COLOUR = 'game.player.colour = "#"+(Math.random()*0xFFFFFF<<0).toString(16);',
  /* you could load a new map variable here */
  NEXT_LEVEL = 'alert("Yay! You won! Reloading map.");game.load_map(map);',
  DEATH = 'alert("You died!");game.load_map(map);',
  UNLOCK = 'game.current_map.keys[10].solid = 0;game.current_map.keys[10].colour = "#888";'
}