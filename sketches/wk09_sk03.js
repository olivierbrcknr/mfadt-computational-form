// require https://cdn.jsdelivr.net/npm/tweakpane@3.0.7/dist/tweakpane.min.js
// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

// personal challenge: Comp Form Bumper

// font loaded via google fonts

const EXPORT = false;
const OUTPUT_FRAME_RATE = 30;
const FRAME_RATE = EXPORT ? 2 : OUTPUT_FRAME_RATE;
const DURATION = 3; // in sec
const FRAMES_TO_SAVE = Math.floor(OUTPUT_FRAME_RATE * DURATION);

const IMAGE_PIXEL_SIZE = 20;

const BG_COLOR = 238; // compform gray

const pixelIDs = [];

const pane = new Tweakpane.Pane();
const PARAMS = {
  frameRate: 0,
  frame: 0,
};

// stole from Justin's CompForm Site
// config
const color_steps = 1000;
const target_size = 10;
const color_s = 1;
const color_b = 1;

// globals
let grid_cols = 0;
let grid_rows = 0;
let grid_width = 0;
let grid_height = 0;
let grid = [];
let cell_history = [];
let cell_history2 = []; // to backup the real history
let current_cell = {
  x: 0,
  y: 0,
  c: 0,
};

function setup() {
  createCanvas(960, 540);

  pixelDensity(2);

  // add monitoring
  const f1 = pane.addFolder({
    title: "Monitoring",
    expanded: true,
  });
  f1.addMonitor(PARAMS, "frameRate");
  f1.addMonitor(PARAMS, "frameRate", {
    view: "graph",
    min: 0,
    max: FRAME_RATE * 1.1,
  });
  f1.addMonitor(PARAMS, "frame");

  frameRate(FRAME_RATE);

  if (EXPORT) {
    console.log("Expected Frames", FRAMES_TO_SAVE);
  }

  setupPixels();
}

function draw() {
  background(BG_COLOR);

  textFont("Miriam Libre");
  textSize(60);
  textAlign(CENTER);
  text("COMP_FORM", width / 2, height / 2);

  if (frameCount < OUTPUT_FRAME_RATE * 2) {
    drawColorfullPixel(0, OUTPUT_FRAME_RATE * 2);
  }

  // show final logo for the last half second
  drawPenroseTriangle(
    width / 2 + 220,
    height / 2 + 80,
    100,
    3,
    OUTPUT_FRAME_RATE * 2,
    OUTPUT_FRAME_RATE * DURATION
  );

  // monitoring
  PARAMS.frameRate = frameRate();
  PARAMS.frame = frameCount;

  // export
  if (EXPORT) {
    saveFrame("bumper", frameCount);
  }

  // end video
  if (frameCount >= FRAMES_TO_SAVE) {
    console.log("Done 🎬");
    noLoop();
  }
}

let img = null;

const setupPixels = () => {
  img = createImage(width / IMAGE_PIXEL_SIZE, height / IMAGE_PIXEL_SIZE);

  grid_cols = floor(width / IMAGE_PIXEL_SIZE);
  grid_rows = floor(height / IMAGE_PIXEL_SIZE);
  grid_width = width / grid_cols;
  grid_height = height / grid_rows;

  // start in lower right corner
  current_cell.x = grid_cols - 1;
  current_cell.y = grid_rows - 1;

  // initialize 2d array
  for (var i = 0; i < grid_cols; i++) {
    grid[i] = [];
  }

  let ID = 0;

  push();
  colorMode(HSB, color_steps);
  img.loadPixels();
  // setup the image
  /* for (let i = 0; i < grid_cols * grid_rows; i++) {
    step();
  } */

  let steps = 0;

  while (
    cell_history.length < grid_cols * grid_rows &&
    steps < grid_cols * grid_rows * 2
  ) {
    step();
    steps++;
  }

  img.updatePixels();
  pop();
};

function step() {
  let x = 0;
  let y = 0;
  let found_open_cell = false;

  // look at adjacent cells in random order, try to find open cell
  // direction is biased right
  let directions = shuffle(["up", "right", "down", "left", "right"]);
  for (const dir of directions) {
    x = current_cell.x;
    y = current_cell.y;

    if (dir == "up") {
      y--;
    } else if (dir == "right") {
      x++;
    } else if (dir == "down") {
      y++;
    } else if (dir == "left") {
      x--;
    }

    x = constrain(x, 0, grid_cols - 1);
    y = constrain(y, 0, grid_rows - 1);

    if (!grid[x][y]) {
      found_open_cell = true;
      break;
    }
  }

  if (found_open_cell) {
    // move into cell
    current_cell.c = ++current_cell.c % color_steps;
    current_cell.x = x;
    current_cell.y = y;

    // mark cell as full
    grid[current_cell.x][current_cell.y] = true;

    // add new cell to history
    cell_history.push({
      x: current_cell.x,
      y: current_cell.y,
      c: current_cell.c,
    });

    cell_history2.push({
      x: current_cell.x,
      y: current_cell.y,
      c: current_cell.c,
    });

    // draw new cell
    img.set(
      current_cell.x,
      current_cell.y,
      color(current_cell.c, color_steps * color_s, color_steps * color_b)
    );
  } else {
    // hit a dead end
    if (cell_history.length) {
      // back up
      current_cell = cell_history.pop();
    } else {
      current_cell.x = floor(random(grid_cols));
      current_cell.y = floor(random(grid_rows));
    }
  }
}

const drawColorfullPixel = (startFrame = 0, endFrame = 30) => {
  push();

  colorMode(HSB, 100);

  const cF = lerp(
    0,
    cell_history2.length,
    frameCount / (endFrame - startFrame)
  );

  img.loadPixels();

  for (let i = 0; i < cF; i++) {
    const cell = cell_history2[i];
    img.set(cell.x, cell.y, color(0, 0));
  }

  img.updatePixels();

  noSmooth();
  image(img, 0, 0, width, height);

  pop();
};

const drawPenroseTriangle = (
  pX = 0,
  pY = 0,
  l = 100,
  sw = 3,
  startF = 0,
  endF = 30
) => {
  push();

  noFill();
  strokeWeight(sw);

  const cF = map(frameCount, startF, endF, 0, 100, true);

  const sh = tan(radians(30)) * (l / 2);
  const h = (l / 2) * sqrt(3);

  const t1x1 = pX - l / 2;
  const t1y1 = pY + sh;
  const t1x2 = pX + l / 2;
  const t1y2 = pY + sh;
  const t1x3 = pX;
  const t1y3 = pY - (h - sh);

  const t2x1 = lerp(t1x1, t1x2, 0.5);
  const t2y1 = lerp(t1y1, t1y2, 0.5);
  const t2x2 = lerp(t1x2, t1x3, 0.5);
  const t2y2 = lerp(t1y2, t1y3, 0.5);
  const t2x3 = lerp(t1x3, t1x1, 0.5);
  const t2y3 = lerp(t1y3, t1y1, 0.5);

  const t3x1 = lerp(t2x2, t2x1, 0.5);
  const t3y1 = lerp(t2y2, t2y1, 0.5);
  const t3x2 = lerp(t1x1, t1x2, 0.75);
  const t3y2 = lerp(t1y1, t1y2, 0.75);
  const t3x3 = lerp(t1x2, t1x3, 0.25);
  const t3y3 = lerp(t1y2, t1y3, 0.25);

  const drawTriangle = (x1, y1, x2, y2, x3, y3, tSF, tEF) => {
    const tCF = map(cF, tSF, tEF, 0, 3, true);

    if (tCF <= 0) {
      // do nothing
    } else if (tCF < 1) {
      const lerpX = lerp(x1, x3, tCF);
      const lerpY = lerp(y1, y3, tCF);

      line(x1, y1, lerpX, lerpY);
    } else if (tCF < 2) {
      const lerpX = lerp(x3, x2, tCF - 1);
      const lerpY = lerp(y3, y2, tCF - 1);

      line(x3, y3, lerpX, lerpY);
      line(x1, y1, x3, y3);
    } else {
      const lerpX = lerp(x2, x1, tCF - 2);
      const lerpY = lerp(y2, y1, tCF - 2);

      line(x2, y2, lerpX, lerpY);
      line(x1, y1, x3, y3);
      line(x3, y3, x2, y2);
    }
  };

  // Outer Triangle
  drawTriangle(t1x1, t1y1, t1x2, t1y2, t1x3, t1y3, 0, 30);

  // Inner Triangle
  drawTriangle(t2x1, t2y1, t2x2, t2y2, t2x3, t2y3, 30, 60);

  // Bottom Right Triangle
  drawTriangle(t3x1, t3y1, t3x2, t3y2, t3x3, t3y3, 60, 90);

  if (cF >= 90) {
    const tOpacity = map(cF, 90, 100, 0, 255);
    const tColor = color(0);
    const tColorEmpty = color(BG_COLOR);
    tColor.setAlpha(tOpacity);
    // tColorEmpty.setAlpha(tOpacity);

    push();
    noStroke();
    fill(tColor);
    triangle(t1x1, t1y1, t1x2, t1y2, t1x3, t1y3);
    fill(tColorEmpty);
    triangle(t2x1, t2y1, t2x2, t2y2, t2x3, t2y3);
    triangle(t3x1, t3y1, t3x2, t3y2, t3x3, t3y3);
    pop();
  }

  pop();
};

const saveFrame = (name, frameNumber, extension = "png") => {
  frameNumber = floor(frameNumber);
  const paddedNumber = ("0000" + frameNumber).substr(-4, 4);
  save(name + "_" + paddedNumber + "." + extension);
};
