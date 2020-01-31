let game = {
  /* settings */
  ctx: null,
  platform: null,
  ball: null,
  background: null,
  blocks: [],
  rows: 4,
  cols: 8,

  /* images */
  sprites: {
    background: null,
    ball: null,
    platform: null,
    block: null
  },
  /*  init */
  init() {
    this.ctx = document.getElementById("mycanvas").getContext("2d");
    this.setEvents();
  },
  /* events */
  setEvents() {
    window.addEventListener("keydown", (e) => {
      const leftButton = 37;
      const rightButton = 39;
      if (e.keyCode === leftButton) {
        this.platform.dx -= this.platform.velocity;
      } else if (e.keyCode === rightButton) {
        this.platform.dx += this.platform.velocity;
      }
    });

    window.addEventListener("keyup", (e) => {
      this.platform.dx = 0;
    });
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
  /* create */
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
  /* update */
  update() {
    this.platform.move();
  },
  /* run */
  run() {
    window.requestAnimationFrame(() => {
      this.update();
      this.render();
      this.run();
    });
  },
  /* render */
  render() {
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
  /*start */
  start() {
    this.init();
    this.preload(() => {
      this.create();
      this.run();
    });
  }
};

/* game objects */
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
  x: 280,
  y: 300,
  velocity: 4,
  dx: 0,

  move() {
    if (this.dx) {
      this.x += this.dx;
    }
  }
};

/* start game onload */
window.addEventListener("load", () => {
  game.start();
});
