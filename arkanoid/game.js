const KEYS = {
    LEFT: 37,
    RIGHT: 39,
    SPACE: 32
};

const Game = {
    ctx: null,
    platform: null,
    ball: null,
    blocks: [],
    running: true,
    rows: 3,
    cols: 10,
    score: 0,
    width: 1280,
    height: 600,
    sprites: {
        background: null,
        ball: null,
        platform: null,
        block: null
    },
    sounds: {
        soundtrack: null,
        bump: null,
        Gameover: null,
        fire: null,
        winner: null,
    },
    init() {
        this.ctx = document.getElementById("mycanvas").getContext("2d");
        this.setTextFont();
        this.setEvents();
    },
    setEvents() {
        window.addEventListener("keydown", e => {
            if (e.keyCode === KEYS.SPACE) {
                this.platform.bump();
            } else if (e.keyCode === KEYS.LEFT || e.keyCode === KEYS.RIGHT) {
                this.platform.start(e.keyCode);
            }
        });
        window.addEventListener("keyup", () => {
            this.platform.pause();
        });
    },
    preload(callback) {
        let loaded = 0;
        let required = Object.keys(this.sprites).length;
        required += Object.keys(this.sounds).length;
        const onResourceLoad = () => {
            ++loaded;
            if (loaded >= required) {
                callback();
            }
        };

        this.preloadSprites(onResourceLoad);
        this.preloadAudio(onResourceLoad);
    },

    preloadSprites(callback) {
        for (let key in this.sprites) {
            this.sprites[key] = new Image();
            this.sprites[key].src = `img/${key}.png`;
            this.sprites[key].addEventListener("load", callback);
        }
    },
    preloadAudio(callback) {
        for (let key in this.sounds) {
            this.sounds[key] = new Audio(`sounds/${key}.mp3`);
            this.sounds[key].addEventListener("canplaythrough", callback, {
                once: true
            });
        }
    },
    create() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                this.blocks.push({
                    active: true,
                    width: 111,
                    height: 39,
                    x: 113 * col + 70,
                    y: 42 * row + 90
                });
            }
        }
    },
    update() {
        this.collideBlocks();
        this.collidePlatform();
        this.ball.collideWorldBounds();
        this.platform.collideWorldBounds();
        this.platform.move();
        this.ball.move();
    },
    collideBlocks() {
        for (let block of this.blocks) {
            if (block.active && this.ball.collide(block)) {
                this.ball.bumpBlock(block);
                this.addScore();
                this.sounds.bump.play();
            }

        }
    },
    collidePlatform() {
        if (this.ball.collide(this.platform)) {
            this.ball.bumpPlatform(this.platform);
            Game.sounds.bump.play();
        }
    },
    run() {
        if (this.running) {
            window.requestAnimationFrame(() => {
                this.update();
                this.render();
                this.run();
            });
        }

    },
    render() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.drawImage(this.sprites.background, 0, 0);
        this.ctx.drawImage(this.sprites.ball, 0, 0, this.ball.width, this.ball.height, this.ball.x, this.ball.y, this.ball.width, this.ball.height);
        this.ctx.drawImage(this.sprites.platform, this.platform.x, this.platform.y);
        this.renderBlocks();

        this.ctx.fillText(`Score: ${this.score}`, 50, 50);
    },
    setTextFont() {
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '26px/1.2 Arial,sans-serif';
    },
    renderBlocks() {
        for (let block of this.blocks) {
            if (block.active) {
                this.ctx.drawImage(this.sprites.block, block.x, block.y);
            }
        }
    },
    start() {
        this.init();

        this.preload(() => {
            this.create();
            this.run();
        });
    },
    random(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    },
    end(result) {
        this.running = false;
        alert(result);
        window.location.reload(true)
    },
    addScore() {
        ++this.score;
        if (this.score >= this.blocks.length) {
            this.sounds.soundtrack.pause();
            this.sounds.winner.play();
            this.end('Вы победили');
        }
    }
};

Game.ball = {
    dx: 0,
    dy: 0,
    velocity: 10,
    x: Game.width / 2 - 20,
    y: Game.height - 85,
    width: 40,
    height: 40,
    start() {
        this.dy = -this.velocity;
        this.dx = Game.random(-this.velocity, this.velocity);
    },
    move() {
        if (this.dy) {
            this.y += this.dy;
        }
        if (this.dx) {
            this.x += this.dx;
        }
    },
    collide(element) {
        let x = this.x + this.dx;
        let y = this.y + this.dy;

        if (x + this.width > element.x &&
            x < element.x + element.width &&
            y + this.height > element.y &&
            y < element.y + element.height) {
            return true;
        }
        return false;
    },
    bumpBlock(block) {
        this.dy *= -1;
        block.active = false;
    },
    bumpPlatform(platform) {

        if (platform.dx) {
            this.x += platform.dx;
        }

        if (this.dy > 0) {
            this.dy = -this.velocity;
            let touchX = this.x + this.width / 2;
            this.dx = this.velocity * platform.getTouchOffset(touchX);

        }
        Game.sounds.bump.play();
    },
    collideWorldBounds() {
        let x = this.x + this.dx;
        let y = this.y + this.dy;

        let ballLeft = x;
        let ballRight = ballLeft + this.width;
        let ballTop = y;
        let ballBottom = ballTop + this.height;

        let worldLeft = 0;
        let worldRight = Game.width;
        let worldTop = 0;
        let worldBottom = Game.height;

        if (ballLeft < worldLeft) {
            this.x = 0;
            this.dx = this.velocity;
            Game.sounds.bump.play();
        } else if (ballRight > worldRight) {
            this.x = worldRight - this.width;
            this.dx = -this.velocity;
            Game.sounds.bump.play();
        } else if (ballTop < worldTop) {
            this.y = 0;
            this.dy = this.velocity;
            Game.sounds.bump.play();
        } else if (ballBottom > worldBottom) {
            Game.sounds.soundtrack.pause();
            Game.sounds.Gameover.play();
            Game.end('Вы проиграли');
        }
    },
};

Game.platform = {
    velocity: 15,
    dx: 0,
    x: Game.width / 2 - 125,
    y: Game.height - 45,
    width: 251,
    height: 41,
    ball: Game.ball,
    bump() {
        if (this.ball) {
            this.ball.start();
            this.ball = null;
            Game.sounds.fire.play();
            Game.sounds.soundtrack.play();
        }
    },
    start(direction) {
        if (direction === KEYS.LEFT) {
            this.dx = -this.velocity;
        } else if (direction === KEYS.RIGHT) {
            this.dx = this.velocity;
        }
    },
    pause() {
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
    getTouchOffset(x) {
        let diff = (this.x + this.width) - x;
        let offset = this.width - diff;
        let result = 2 * offset / this.width;
        return result - 1;
    },
    collideWorldBounds() {
        let x = this.x + this.dx;

        let platformLeft = x;
        let platformRight = platformLeft + this.width;

        let worldLeft = 0;
        let worldRight = Game.width;

        if (platformLeft < worldLeft || platformRight > worldRight) {
            this.dx = 0;
        }
    },
};

window.addEventListener("load", () => {
    Game.start();
});
