let game = {
  ctx: null,
  platform: null,
  ball: null,
  background: null,
  blocks: [],
  rows: 5,
  cols: 5,

  sprites: {
    background: null,
    ball: null,
    platform: null,
    block: null
  },
  init() {
    this.ctx = document.getElementById("mycanvas").getContext("2d");
    this.setEvents();
  },

  setEvents() {
    window.addEventListener("keydown", e => {
      const left = 37;
      const right = 39;
      if (e.keyCode === left) {
        this.platform.dx -= this.platform.velocity;
      } else if (e.keyCode === right) {
        this.platform.dx += this.platform.velocity;
      }
    });

    window.addEventListener("keyup", e => {
      this.platform.dx = 0;
    });
  },

  preload(callback) {
    let loaded = 0;
    let required = Object.keys(this.sprites).length;
    const onImageLoad = () => {
      ++loaded;
      if (loaded >= required) callback();
    };

    for (let key in this.sprites) {
      this.sprites[key] = new Image();
      this.sprites[key].src = "img/" + key + ".png";
      this.sprites[key].addEventListener("load", onImageLoad);
    }
  },
  create() {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        this.blocks.push({
          x: 115 * col + 20,
          y: 44 * row + 10
        });
      }
    }
  },

  update() {
    this.platform.move();
  },

  run() {
    window.requestAnimationFrame(() => {
      this.update();
      this.render();
      this.run();
    });
  },

  render() {
    const { background, ball, platform, block } = this.sprites;
    this.ctx.drawImage(background, this.background.x, this.background.y);
    this.ctx.drawImage(ball, this.ball.x, this.ball.y);
    this.ctx.drawImage(platform, this.platform.x, this.platform.y);
    for (let b of this.blocks) {
      this.ctx.drawImage(block, b.x, b.y);
    }
  },
  start() {
    this.init();
    this.preload(() => {
      this.create();
      this.run();
    });
  }
};

game.background = {
  x: 0,
  y: 0
};
game.ball = {
  x: 320,
  y: 280,
  width: 20,
  height: 20
};
game.platform = {
  velocity: 6,
  dx: 0,
  x: 280,
  y: 300,
  move() {
    if (this.dx) {
      this.x += this.dx;
    }
  }
};

window.addEventListener("load", () => {
  game.start();
});
