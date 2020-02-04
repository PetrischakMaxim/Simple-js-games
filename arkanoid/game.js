/* game keys */
const KEYS = {
  LEFT: 37,
  RIGHT: 39,
  SPACE: 32
};

let game = {
  /* game settings */
  ctx: null,
  platform: null,
  ball: null,
  background: null,
  blocks: [],
  rows: 4,
  cols: 8,
  width: 1280,
  height: 646,
  /* images */
  sprites: {
    background: null,
    ball: null,
    platform: null,
    block: null
  },
  /*  init  game */
  init() {
    this.ctx = document.getElementById("mycanvas").getContext("2d");
    this.setEvents();
  },
  /* game events */
  setEvents() {
    window.addEventListener("keydown", (e) => {
      if (e.keyCode === KEYS.SPACE) {
        this.platform.fire();
      } else if (e.keyCode === KEYS.LEFT || e.keyCode === KEYS.RIGHT) {
        this.platform.start(e.keyCode);
      }
    });

    window.addEventListener("keyup", () => this.platform.stop());
  },
  /* preload for images */
  preload(callback) {
    let loaded = 0;
    const { sprites } = this;
    const required = Object.keys(sprites).length;
    const onImageLoad = () => {
      ++loaded;
      if (loaded >= required) callback();
    };

    for (let key in sprites) {
      sprites[key] = new Image();
      sprites[key].src = `img/${key}.png`;
      sprites[key].addEventListener("load", onImageLoad);
    }
  },
  /* create blocks */
  create() {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        this.blocks.push({
          x: 115 * col + 65,
          y: 44 * row + 35
        });
      }
    }
  },
  /* update game */
  update() {
    this.platform.move();
    this.ball.move();
  },
  /* run game */
  run() {
    window.requestAnimationFrame(() => {
      this.update();
      this.render();
      this.run();
    });
  },
  /* render content */
  render() {
    this.ctx.clearRect(0, 0, this.width, this.height); /* clear canvas field */
    const { background, ball, platform, block } = this.sprites;
    this.ctx.drawImage(background, this.background.x, this.background.y);
    this.ctx.drawImage(ball, this.ball.x, this.ball.y);
    this.ctx.drawImage(platform, this.platform.x, this.platform.y);
    this.renderBlocks(block);
  },
  /* render blocks */
  renderBlocks(block) {
    for (let b of this.blocks) {
      this.ctx.drawImage(block, b.x, b.y);
    }
  },
  /* start game */
  start() {
    this.init();
    this.preload(() => {
      this.create();
      this.run();
    });
  },
  /* random fn() */
  random(min,max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
};

/* game objects */
game.background = {
  x: 0,
  y: 0
};

game.ball = {
  dx: 0,
  dy: 0,
  velocity: 3,
  x: 375,
  y: 265,
  width: 20,
  height: 20,

  start() {
    this.dy = -this.velocity;
    this.dx = game.random(-this.velocity, this.velocity);
  },

  move() {
    if (this.dy) {
      this.y += this.dy;
    }
    if (this.dx) {
      this.x += -this.dx;
    }
  }
};

game.platform = {
  x: 280,
  y: 300,
  velocity: 6,
  dx: 0,
  ball: game.ball,

  start(diretion) {
    if (diretion === KEYS.LEFT) {
      this.dx = -this.velocity;
    } else if (diretion === KEYS.RIGHT) {
      this.dx = this.velocity;
    }
  },

  stop() {
    this.dx = 0;
  },

  move() {
    if (this.dx) {
      this.x += this.dx;
      if (this.ball) {
        this.ball.x += this.dx;
      }
    }
  },

  fire() {
    if (this.ball) {
      this.ball.start();
      this.ball = null;
    }
  },



};

/* start game after page onload */
window.addEventListener("load", () => {
  game.start();
});
