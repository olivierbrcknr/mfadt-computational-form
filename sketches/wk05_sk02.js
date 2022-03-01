// require https://cdn.jsdelivr.net/npm/tweakpane@3.0.7/dist/tweakpane.min.js
// require https://cdn.jsdelivr.net/npm/p5@1.4.0
// Dot Challenge — Extension

const pane = new Tweakpane.Pane();

// parameteres
const PARAMS = {
  strokeWidth: 2,
  frequency: 0.2,
  seed: 30,
  pointCount: 5,
  lineCount: 20,
};

function setup() {
  createCanvas(400, 400);
  colorMode(HSB, 100);
  noLoop();
  noFill();

  pane.addInput(PARAMS, "strokeWidth", {
    min: 0,
    max: 10,
  });
  pane.addInput(PARAMS, "frequency", {
    step: 0.01,
    min: 0,
    max: 1,
  });
  pane.addInput(PARAMS, "seed", {
    min: 1,
    max: 1000,
  });
  pane.addInput(PARAMS, "pointCount", {
    step: 1,
    min: 1,
    max: 50,
  });
  pane.addInput(PARAMS, "lineCount", {
    step: 1,
    min: 1,
    max: 50,
  });

  pane.on("change", () => {
    redraw();
  });
}

function draw() {
  background(`rgb(50,50,50)`);
  noiseSeed(PARAMS.seed);
  strokeWeight(PARAMS.strokeWidth);

  let x = 0;
  let y = 0;

  for (let l = 0; l < PARAMS.lineCount; l++) {
    stroke(map(l, 0, PARAMS.lineCount, 0, 100), 255, 255);

    beginShape();
    for (let i = 0; i <= PARAMS.pointCount; i++) {
      const p = l * PARAMS.pointCount + i;

      x = noise(p * PARAMS.frequency, 0) * width;
      y = noise(p * PARAMS.frequency, 100) * height;

      if (i === 0 || i === PARAMS.pointCount) {
        curveVertex(x, y);
      }
      curveVertex(x, y);
    }
    endShape();
  }
}
