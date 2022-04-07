// require https://cdn.jsdelivr.net/npm/tweakpane@3.0.7/dist/tweakpane.min.js
// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

const EXPORT = false;
const OUTPUT_FRAME_RATE = 30;
const FRAME_RATE = EXPORT ? 1 : OUTPUT_FRAME_RATE;
const DURATION = 6; // in sec
const FRAMES_TO_SAVE = Math.floor(OUTPUT_FRAME_RATE * DURATION);

const IMAGE_PIXEL_SIZE = 140;

const pane = new Tweakpane.Pane();
const PARAMS = {
  frameRate: 0,
  colorLight: "#FFF",
  colorDark: "#00F",
  dither: true,
};

let pg = null;
let img = null;

function setup() {
  createCanvas(500, 500);

  pg = createGraphics(IMAGE_PIXEL_SIZE, IMAGE_PIXEL_SIZE);
  img = createImage(IMAGE_PIXEL_SIZE, IMAGE_PIXEL_SIZE);

  pixelDensity(1);
  pg.pixelDensity(1);

  // add monitoring
  const f1 = pane.addFolder({
    title: "Monitoring",
    expanded: false,
  });
  f1.addMonitor(PARAMS, "frameRate");
  f1.addMonitor(PARAMS, "frameRate", {
    view: "graph",
    min: 0,
    max: FRAME_RATE * 1.1,
  });
  pane.addInput(PARAMS, "colorLight");
  pane.addInput(PARAMS, "colorDark");
  pane.addInput(PARAMS, "dither");

  frameRate(FRAME_RATE);

  if (EXPORT) {
    console.log("Expected Frames", FRAMES_TO_SAVE);
  }
}

function draw() {
  pg.blendMode(BLEND);
  pg.background(255);
  pg.noStroke();
  pg.blendMode(MULTIPLY);

  pg.push();
  pg.translate(pg.width / 2, pg.height / 2);

  pg.rotate((frameCount / 60) * PI);

  const distFromCenter =
    (sin((frameCount / (OUTPUT_FRAME_RATE * 3)) * PI) + 0.5) * 30;

  for (let i = 0; i < 10; i++) {
    pg.rotate(TWO_PI / 10);
    drawGradientBox(distFromCenter, -10, 50, 20, 10);
  }
  pg.pop();

  if (PARAMS.dither) {
    noSmooth();
    ditherImg();
    image(img, 0, 0, width, height);
  } else {
    image(pg, 0, 0, width, height);
  }

  PARAMS.frameRate = frameRate();

  if (EXPORT) {
    if (frameCount <= FRAMES_TO_SAVE) {
      saveFrame("dither", frameCount);
    } else {
      console.log("Done 🎬");
      noLoop();
    }
  }
}

const drawGradientBox = (x, y, w, h, steps) => {
  const stepW = int(w / steps);

  for (let i = 0; i < steps; i++) {
    pg.fill(map(i, 0, steps, 0, 200));
    pg.rect(x + stepW * i, y, stepW, h);
  }
};

// Dither code is picked from here
// https://editor.p5js.org/ssergiorodriguezz/sketches/KA3s21awe
const matrix4 = [
  [0.5, 2],
  [3, 1],
];
const matrix16 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

const matrix = matrix16;
const unit = 255 / (matrix[0].length * matrix.length);

const filter = [];
for (let y = 0; y < matrix.length; y++) {
  filter[y] = [];
  for (let x = 0; x < matrix[0].length; x++) {
    filter[y][x] = unit * matrix[y][x];
  }
}

const ditherImg = () => {
  pg.loadPixels();
  img.loadPixels();

  const cL = color(PARAMS.colorLight);
  const cD = color(PARAMS.colorDark);

  let pix = 0;
  for (let i = 0; i < pg.width * pg.height * 4; i += 4) {
    const x = (pix % pg.width) % filter[0].length;
    const y = floor(pix / pg.height) % filter.length;
    const avg = (pg.pixels[i + 0] + pg.pixels[i + 1] + pg.pixels[i + 2]) / 3;
    const isWhite = filter[y][x] < avg ? true : false;

    img.pixels[i + 0] = isWhite ? cL.levels[0] : cD.levels[0];
    img.pixels[i + 1] = isWhite ? cL.levels[1] : cD.levels[1];
    img.pixels[i + 2] = isWhite ? cL.levels[2] : cD.levels[2];

    img.pixels[i + 3] = 255;

    pix++;
  }

  img.updatePixels();
};

const saveFrame = (name, frameNumber, extension = "png") => {
  frameNumber = floor(frameNumber);
  const paddedNumber = ("0000" + frameNumber).substr(-4, 4);
  save(name + "_" + paddedNumber + "." + extension);
};
