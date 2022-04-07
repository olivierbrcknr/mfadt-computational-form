// require https://cdn.jsdelivr.net/npm/tweakpane@3.0.7/dist/tweakpane.min.js
// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

const EXPORT = false;
const OUTPUT_FRAME_RATE = 30;
const FRAME_RATE = EXPORT ? 1 : OUTPUT_FRAME_RATE;
const DURATION = 6; // in sec
const FRAMES_TO_SAVE = Math.floor(OUTPUT_FRAME_RATE * DURATION);

const pane = new Tweakpane.Pane();
const PARAMS = {
  frameRate: 0,
  colorStroke: "#FFF",
  colorBG: "#0000000c",
  strokeWeight: 1,
  revolutionsPerSecond: 0.5,
  circleDiameter: 60,
  ratio: 1,
};

let pg = null;
let img = null;

function setup() {
  createCanvas(500, 500);

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

  pane.addInput(PARAMS, "colorStroke");
  pane.addInput(PARAMS, "colorBG");
  pane.addInput(PARAMS, "strokeWeight", {
    min: 0,
    max: 5,
  });
  pane.addInput(PARAMS, "circleDiameter", {
    min: 0,
    max: 100,
  });
  pane.addInput(PARAMS, "revolutionsPerSecond", {
    min: 0.001,
    max: 2,
  });

  pane.addInput(PARAMS, "ratio", {
    step: 1,
    min: 1,
    max: 10,
  });

  frameRate(FRAME_RATE);

  if (EXPORT) {
    console.log("Expected Frames", FRAMES_TO_SAVE);
  }

  const initColor = color(PARAMS.colorBG);
  initColor.setAlpha(255);
  background(initColor);
}

function draw() {
  background(PARAMS.colorBG);
  stroke(PARAMS.colorStroke);
  noFill();

  strokeWeight(PARAMS.strokeWeight * 2);
  circle(width / 3, height / 2, PARAMS.circleDiameter);
  circle((width / 3) * 2, height / 2, PARAMS.circleDiameter);

  strokeWeight(PARAMS.strokeWeight);

  push();

  const revolutions =
    (frameCount / OUTPUT_FRAME_RATE) * PI * PARAMS.revolutionsPerSecond;

  const posX =
    width / 2 +
    sin(PARAMS.ratio * revolutions) * (width / 4 + PARAMS.circleDiameter / 2);
  const posY =
    height / 2 +
    cos(revolutions) * sin(revolutions) * PARAMS.circleDiameter * 2;

  translate(posX, posY);

  circle(0, 0, 10);

  pop();

  PARAMS.frameRate = frameRate();

  if (EXPORT) {
    if (frameCount <= FRAMES_TO_SAVE) {
      saveFrame("sketch", frameCount);
    } else {
      console.log("Done 🎬");
      noLoop();
    }
  }
}

const saveFrame = (name, frameNumber, extension = "png") => {
  frameNumber = floor(frameNumber);
  const paddedNumber = ("0000" + frameNumber).substr(-4, 4);
  save(name + "_" + paddedNumber + "." + extension);
};
