// require https://cdn.jsdelivr.net/npm/tweakpane@3.0.7/dist/tweakpane.min.js
// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

// Pair Challenge with Yang Zhao

const pane = new Tweakpane.Pane();

// parameteres
const PARAMS = {
  pixelStep: 5,
  sparkSpeed: 2,
  sparkLifeLength: 50,
  colorBright: "#FFBF00",
  colorDark: "#C70039",
};

let baseImg = null;
let values = [];
const FIRE = [];

function preload() {
  baseImg = loadImage("/baseImg.png");
}

function setup() {
  createCanvas(437, 441);

  pane
    .addInput(PARAMS, "pixelStep", {
      step: 1,
      min: 3,
      max: 50,
    })
    .on("change", () => {
      // update pixels on change
      createValueArray();
    });

  const f1 = pane.addFolder({
    title: "Sparks",
  });
  f1.addInput(PARAMS, "sparkSpeed", {
    min: 1,
    max: 20,
  });
  f1.addInput(PARAMS, "sparkLifeLength", {
    min: 10,
    max: 100,
  });
  f1.addInput(PARAMS, "colorBright", {
    view: "color",
  });
  f1.addInput(PARAMS, "colorDark", {
    view: "color",
  });

  pane.on("change", () => {
    for (let i = 0; i < FIRE.length; i++) {
      FIRE[i].updateValues();
    }
  });

  noSmooth();
  noStroke();

  createValueArray();
}

function draw() {
  background(0);
  for (let i = 0; i < FIRE.length; i++) {
    FIRE[i].draw();
  }
}

class FireParticle {
  constructor(x, y, v) {
    this.x = x;
    this.y = y;
    this.v = v;
    this.shiftY = 0;
    this.lifeCount = 0;
    this.randomVal = random(0.8, 1.2);
    this.lifeLength =
      map(this.v, 0, 1, 10, PARAMS.sparkLifeLength, true) * this.randomVal;
    this.color = lerpColor(
      color(PARAMS.colorBright),
      color(PARAMS.colorDark),
      v
    );
    this.diam = map(this.v, 0, 1, 1, PARAMS.pixelStep, true);
  }
  draw() {
    this.shiftY -= PARAMS.sparkSpeed * (1 - this.v);
    const p = abs(this.shiftY) / this.lifeLength;
    if (p > 1) {
      this.shiftY = 0;
      this.lifeCount = 0;
    }

    push();
    const x = this.x;
    const y = this.y;
    const diam = this.diam * (1 - p);

    const shiftX = noise(frameCount * 0.1, x * y) * PARAMS.pixelStep;

    translate(shiftX, this.shiftY);

    fill(this.color);
    rect(x, y, diam, diam);
    pop();

    this.lifeCount++;
  }
  updateValues() {
    this.lifeLength =
      map(this.v, 0, 1, 10, PARAMS.sparkLifeLength, true) * this.randomVal;
    this.color = lerpColor(
      color(PARAMS.colorBright),
      color(PARAMS.colorDark),
      this.v
    );
  }
}

function createValueArray() {
  // empty array
  FIRE.splice(0, FIRE.length);

  baseImg.loadPixels();

  for (let y = 0; y < baseImg.height; y += PARAMS.pixelStep) {
    for (let x = 0; x < baseImg.width; x += PARAMS.pixelStep) {
      const pxColor = getQuick(baseImg, x, y);
      let val = 1 - pxColor.r / 255;
      if (val > 0.01) {
        val = map(val, 0, 0.7, 0, 1);
        FIRE.push(new FireParticle(x, y, val));
      }
    }
  }
}

function getQuick(img, x, y) {
  const i = (y * img.width + x) * 4;
  return {
    r: img.pixels[i],
    g: img.pixels[i + 1],
    b: img.pixels[i + 2],
    a: img.pixels[i + 3],
  };
}

function setQuick(img, x, y, c) {
  const i = (y * img.width + x) * 4;
  img.pixels[i + 0] = c.levels[0];
  img.pixels[i + 1] = c.levels[1];
  img.pixels[i + 2] = c.levels[2];
  img.pixels[i + 3] = c.levels[3] ? c.levels[3] : 255;
}
