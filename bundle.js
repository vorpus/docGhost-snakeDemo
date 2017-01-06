/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const SnakeGame = __webpack_require__(1);
	const SnakeView = __webpack_require__(2);
	
	$l( () => {
	  const rootEl = $l('.snake');
	  const game = new SnakeGame();
	  new SnakeView(game, rootEl);
	});


/***/ },
/* 1 */
/***/ function(module, exports) {

	class Snake {
	  constructor () {
	    this.direction = "S";
	    this.segments = [new Coord(0,0)];
	    this.length = 1;
	  }
	
	  move() {
	    let currentLoc = this.segments[this.segments.length-1];
	    let nextLoc = currentLoc.plus(this.direction);
	    this.segments.push(nextLoc);
	    this.removeTail();
	  }
	
	  removeTail() {
	    while (this.segments.length > this.length) {
	      this.segments.shift();
	    }
	  }
	
	  turn(dir) {
	    this.direction = dir;
	  }
	
	  eat() {
	    this.length += 3;
	  }
	}
	
	class Coord {
	  constructor(x,y) {
	    this.x = x;
	    this.y = y;
	  }
	
	  equals(pos) { //another coord obj
	    if (this.x === pos.x && this.y === pos.y) {
	      return true;
	    }
	    return false;
	  }
	
	  getCoord() {
	    return [this.x,this.y];
	  }
	
	  plus(dir) {
	    let nextLoc;
	    switch(dir) {
	      case "N":
	        nextLoc = new Coord(this.x, this.y - 1);
	        break;
	      case "S":
	        nextLoc = new Coord(this.x, this.y + 1);
	        break;
	      case "E":
	        nextLoc = new Coord(this.x + 1, this.y);
	        break;
	      case "W":
	        nextLoc = new Coord(this.x - 1, this.y);
	        break;
	    }
	    return nextLoc;
	  }
	}
	
	
	class Board {
	  constructor() {
	    this.grid = Board.makeGrid();
	    this.snake = new Snake();
	    this.apples = [];
	    this.newApple();
	  }
	
	  deadSnake() {
	    this.snake = new Snake();
	  }
	
	  snakeBounds () {
	    let snakeHead = this.snake.segments[this.snake.segments.length-1].getCoord();
	    if (snakeHead[0] > 19 || snakeHead[0] < 0 || snakeHead[1] > 19 || snakeHead[1] < 0) {
	      return true;
	    }
	  }
	
	  snakeSuicide() {
	    let snakeHead = this.snake.segments[this.snake.segments.length-1];
	    let snakeBody = this.snake.segments.slice(0, this.snake.segments.length-1);
	
	    let suicide = false;
	    snakeBody.forEach( (body) => {
	      if (body.equals(snakeHead)) {
	        suicide = true;
	      }
	    });
	    return suicide;
	  }
	
	  snakeEating() {
	    let snakeHead = this.snake.segments[this.snake.segments.length-1];
	    let overlapApple;
	
	    this.apples.forEach( (apple) => {
	      if (apple.equals(snakeHead)) {
	        this.apples.splice(this.apples.indexOf(apple), 1);
	        this.snake.eat();
	        this.newApple();
	      }
	    });
	  }
	
	  newApple() {
	    let appleCoord = new Coord(Math.floor(Math.random() * 20), Math.floor(Math.random() * 20));
	    while( this.appleOverlapSnake(appleCoord) ) {
	      appleCoord = new Coord(Math.floor(Math.random() * 20), Math.floor(Math.random() * 20));
	    }
	    this.apples.push(appleCoord);
	  }
	
	  appleOverlapSnake(appleCoord) {
	    let overlap = false;
	    this.snake.segments.forEach( (seg) => {
	      if (seg.equals(appleCoord)) {
	        overlap = true;
	      }
	    });
	    this.apples.forEach( (seg) => {
	      if (seg.equals(appleCoord)) {
	        overlap = true;
	      }
	    });
	    return overlap;
	  }
	
	  static makeGrid() {
	    const grid = [];
	
	    for (let i = 0; i < 20; i++) {
	      grid.push([]);
	      for (let j = 0; j < 20; j++) {
	        grid[i].push(null);
	      }
	    }
	    return grid;
	  }
	}
	
	module.exports = Board;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Board = __webpack_require__(1);
	
	class View {
	  constructor(game, $view) {
	    this.game = game;
	    this.$view = $view;
	    this.board = new Board();
	    this.makeGrid();
	    this.render();
	    $l('body').on("keydown", (ev) => {
	      this.handleKeyEvent(ev);
	    });
	
	
	
	    window.setInterval(() => {
	      this.step();
	      if (this.board.snakeBounds() || this.board.snakeSuicide()) {
	        this.board.deadSnake();
	      }
	      this.render();
	
	    }, 120);
	
	  }
	
	  // squareGrid() {
	  //   var mapElement = $l("li");
	  //   mapElement.css('height', mapElement.css('width'));
	  //
	  //   window.addEventListener("resize", function(e) {
	  //     var mapElement = $l("li");
	  //     mapElement.css('height', mapElement.css('width'));
	  //   });
	  // }
	
	  makeGrid() {
	    this.board.grid.forEach( (el, i) => {
	      const newUl = document.createElement('ul');
	      newUl.className = 'group';
	      let $gridRow = $l(newUl);
	      el.forEach( (_,j) => {
	        $gridRow.append($l(document.createElement('li')));
	      });
	      this.$view.append($gridRow);
	    });
	  }
	
	  render() {
	    let grid = this.board.grid;
	    $l('li').attr('style', 'background:lightblue');
	
	    this.makeSnake();
	    this.makeApple();
	  }
	
	  makeSnake() {
	    this.board.snake.segments.forEach((seg) => {
	      $l($l($l('ul').get(seg.y)).children().get(seg.x)).attr('style', 'background:blue');
	    });
	  }
	
	  makeApple() {
	    this.board.apples.forEach( (apple) => {
	      $l($l($l('ul').get(apple.y)).children().get(apple.x)).attr('style', 'background:red');
	    });
	  }
	
	  handleKeyEvent(ev) {
	    switch(String.fromCharCode(ev.which)) {
	      case "&":
	      case "W":
	        this.board.snake.turn("N");
	        break;
	      case "'":
	      case "D":
	        this.board.snake.turn("E");
	        break;
	      case "%":
	      case "A":
	        this.board.snake.turn("W");
	        break;
	      case "(":
	      case "S":
	        this.board.snake.turn("S");
	        break;
	      default:
	        break;
	    }
	  }
	
	
	  step () {
	    this.board.snake.move();
	    this.board.snakeEating();
	  }
	}
	
	module.exports = View;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map