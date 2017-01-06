const Board = require('./snake.js');

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
