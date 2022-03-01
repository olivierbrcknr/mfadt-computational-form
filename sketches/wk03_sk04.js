// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

// inspired by The Legend Of Zelda
// built upon my previous code → https://editor.p5js.org/olivierbrcknr/sketches/GY96-8ybI

// https://www.spriters-resource.com/nes/legendofzelda/sheet/8375/

const scale = 2;

const tileSize = 16 * scale;
const tileW = 24;
const tileH = 16;

const roomW = tileW * 16;
const roomH = tileH * 16;

const fr = 20;
const stepSize = (60 / fr) * scale;

const margin = 24 * scale;
const hitBoxMargin = 4 * scale;

let link = null;
let masterSword = null;
const tiles = [];
const obstacles = [];

let bg1 = null;
let bg2 = null;
const tiles1 = {};
const tiles2 = {};
const linkSprites = {};

let canvas = null;

let gameIsWon = true;
let triforceImg = null;

function preload() {
  bg1 = loadImage("img/bg_1.jpg");
  bg2 = loadImage("img/bg_2.jpg");

  triforceImg = loadImage("img/triforce.png");

  tiles1.floor = loadImage("img/tile_1_floor.jpg");
  tiles1.obstacle = loadImage("img/tile_1_obstacle.jpg");
  tiles1.switch = loadImage("img/tile_1_switch.jpg");
  tiles1.switchAct = loadImage("img/tile_1_switch_act.jpg");
  tiles1.stairs = loadImage("img/tile_1_stairs.jpg");

  tiles1.floor_1 = loadImage("img/floor_1.jpg");
  tiles1.floor_2 = loadImage("img/floor_2.jpg");
  tiles1.tree = loadImage("img/tree.jpg");
  tiles1.stone = loadImage("img/rock_2.png");

  tiles1.masterSword = loadImage("img/masterSword.png");

  tiles2.floor = loadImage("img/tile_2_floor.jpg");
  tiles2.obstacle = loadImage("img/tile_2_obstacle.jpg");
  tiles2.switch = loadImage("img/tile_2_switch.jpg");
  tiles2.switchAct = loadImage("img/tile_2_switch_act.jpg");
  tiles2.stairs = loadImage("img/tile_2_stairs.jpg");

  linkSprites.up1 = loadImage("img/link_up_1.png");
  linkSprites.up2 = loadImage("img/link_up_2.png");
  linkSprites.down1 = loadImage("img/link_down_1.png");
  linkSprites.down2 = loadImage("img/link_down_2.png");
  linkSprites.right1 = loadImage("img/link_right_1.png");
  linkSprites.right2 = loadImage("img/link_right_2.png");
  linkSprites.left1 = loadImage("img/link_left_1.png");
  linkSprites.left2 = loadImage("img/link_left_2.png");
}

function resetGame() {
  tiles.splice(0, tiles.length);
  obstacles.splice(0, obstacles.length);

  noiseSeed(int(random(1000)));

  gameIsWon = false;

  link = new Link();

  createMap();
  link.placeOnMap();

  masterSword = new Gate();
  masterSword.placeOnMap();
}

function setup() {
  canvas = createCanvas(roomW * scale, roomH * scale);
  frameRate(fr);

  noSmooth();
  textAlign(CENTER, CENTER);
  textSize(14);

  resetGame();
}

function draw() {
  background(200);

  if (gameIsWon) {
    push();
    background(0);

    image(triforceImg, width / 2, height / 2, 10, 10);

    fill(255);
    text("You saved Hyrule!", width / 2, height / 2 + 40);
    pop();
  } else {
    tiles.forEach((t) => {
      t.draw();
    });

    masterSword.draw();

    link.draw();
  }
}

function createMap() {
  for (let row = 0; row < tileW; row++) {
    for (let col = 0; col < tileH; col++) {
      let n = noise(row * 0.2, col * 0.1);

      let tileType = "floor";

      if (n < 0.3) {
        tileType = "floor_1";
      } else if (n < 0.5) {
        tileType = "floor_2";
      } else if (n < 0.7) {
        tileType = "tree";
      } else {
        tileType = "stone";
      }

      tiles.push(
        // room 1
        new Tile(row, col, tileType)
      );
    }
  }

  /*
  gates.push(
    // room 1
    new Gate(2,3,"H", true),
    new Gate(4,6,"M", true),

    // room 2
    new Gate(6,2,"M", false),
    new Gate(11,2,"H", false),
  )*/

  tiles.forEach((t) => {
    if (t.type === "obstacle" || t.type === "tree" || t.type === "stone") {
      obstacles.push({
        x: t.x,
        y: t.y,
      });
    }
  });
}

class Link {
  constructor() {
    this.x = 0;
    this.y = 0;

    this.dir = "down";
    this.step = false;
    this.newStep = false;
    this.currentSprite = linkSprites.down1;
    this.isFlip = false;
  }
  placeOnMap() {
    let possibleTiles = tiles.filter(
      (t) => t.type === "floor_1" || t.type === "floor_2"
    );
    const startPoint = random(possibleTiles);
    this.x = startPoint.x;
    this.y = startPoint.y;
  }

  draw() {
    if (keyIsPressed) {
      this.move();
    }
    if (this.newStep) {
      this.step = !this.step;
      this.isFlip = false;
      switch (this.dir) {
        case "down":
          if (this.step) {
            this.currentSprite = linkSprites.down1;
          } else {
            this.currentSprite = linkSprites.down2;
          }
          break;
        case "right":
          if (this.step) {
            this.currentSprite = linkSprites.right1;
          } else {
            this.currentSprite = linkSprites.right2;
          }
          break;
        case "up":
          if (this.step) {
            this.currentSprite = linkSprites.up1;
          } else {
            this.currentSprite = linkSprites.up2;
          }
          break;
        case "left":
          if (this.step) {
            this.currentSprite = linkSprites.left1;
          } else {
            this.currentSprite = linkSprites.left2;
          }
          break;
      }
    }

    push();
    image(this.currentSprite, this.x, this.y, tileSize, tileSize);
    pop();

    this.newStep = false;
  }

  move() {
    this.newStep = true;

    switch (keyCode) {
      case DOWN_ARROW:
        this.dir = "down";
        if (this.checkObstacles(this.dir)) {
          this.y += stepSize;
          if (this.y >= (tileH - 1) * tileSize) {
            this.y = (tileH - 1) * tileSize;
          }
        }
        break;
      case UP_ARROW:
        this.dir = "up";
        if (this.checkObstacles(this.dir)) {
          this.y -= stepSize;
          if (this.y <= 0) {
            this.y = 0;
          }
        }
        break;
      case LEFT_ARROW:
        this.dir = "left";
        if (this.checkObstacles(this.dir)) {
          this.x -= stepSize;
          if (this.x <= 0) {
            this.x = 0;
          }
        }
        break;
      case RIGHT_ARROW:
        this.dir = "right";
        if (this.checkObstacles(this.dir)) {
          this.x += stepSize;
          if (this.x >= (tileW - 1) * tileSize) {
            this.x = (tileW - 1) * tileSize;
          }
        }
        break;

      default:
        this.newStep = false;
        break;
    }
  }

  checkObstacles(dir) {
    let IsAllowedToMove = true;

    let filteredObstactles = obstacles;

    const linkP = {
      left: link.x,
      right: link.x + tileSize,
      top: link.y,
      bottom: link.y + tileSize,
    };

    filteredObstactles.forEach((o) => {
      if (IsAllowedToMove) {
        switch (dir) {
          case "down":
            if (linkP.right > o.x && linkP.left < o.x + tileSize) {
              if (linkP.bottom <= o.y) {
                if (linkP.bottom + stepSize >= o.y) {
                  IsAllowedToMove = false;
                }
              }
            }

            break;
          case "up":
            if (linkP.right > o.x && linkP.left < o.x + tileSize) {
              if (linkP.top >= o.y + tileSize) {
                if (linkP.top - stepSize <= o.y + tileSize) {
                  IsAllowedToMove = false;
                }
              }
            }

            break;
          case "left":
            if (linkP.bottom > o.y && linkP.top < o.y + tileSize) {
              if (linkP.left >= o.x + tileSize) {
                if (linkP.left - stepSize <= o.x + tileSize) {
                  IsAllowedToMove = false;
                }
              }
            }

            break;
          case "right":
            if (linkP.bottom > o.y && linkP.top < o.y + tileSize) {
              if (linkP.right <= o.x) {
                if (linkP.right + stepSize >= o.x) {
                  IsAllowedToMove = false;
                }
              }
            }

            break;
        }
      }
    });

    return IsAllowedToMove;
  }
}

class Tile {
  constructor(posX = 1, posY = 1, type = "floor_1") {
    this.x = posX * tileSize;
    this.y = posY * tileSize;
    this.type = type;
    this.tiles = tiles1;
    this.image = this.tiles[type];
  }
  draw() {
    if (this.type === "masterSword") {
      image(
        this.image,
        this.x + 2 * scale,
        this.y,
        tileSize - 8 * scale,
        tileSize
      );
    } else {
      image(this.image, this.x, this.y, tileSize, tileSize);
    }
  }
}

class Gate {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.tile = null;
  }
  placeOnMap() {
    let possibleTiles = tiles.filter(
      (t) => t.type === "floor_1" || t.type === "floor_2"
    );
    const startPoint = random(possibleTiles);
    this.x = startPoint.x;
    this.y = startPoint.y;
    this.tile = new Tile(this.x / tileSize, this.y / tileSize, "masterSword");
  }
  draw() {
    // only draw it if it is in this position
    this.tile.draw();
    this.checkCollision();
  }

  checkCollision() {
    const linkP = {
      left: link.x,
      right: link.x + tileSize,
      top: link.y,
      bottom: link.y + tileSize,
    };

    if (
      linkP.right >= this.x + hitBoxMargin &&
      linkP.left <= this.x + tileSize - hitBoxMargin
    ) {
      if (
        linkP.bottom >= this.y + hitBoxMargin &&
        linkP.top <= this.y + tileSize - hitBoxMargin
      ) {
        console.log("HIT");
        gameIsWon = true;
      }
    }
  }
}

function keyPressed() {
  if (keyCode === ENTER) {
    resetGame();
  }
  if (key == "s" || key == "S") {
    saveCanvas(canvas, "noise_zelda", "jpg");
  }
}
