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
