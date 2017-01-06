const SnakeGame = require('./snake.js');
const SnakeView = require('./snake-view.js');

$l( () => {
  const rootEl = $l('.snake');
  const game = new SnakeGame();
  new SnakeView(game, rootEl);
});
