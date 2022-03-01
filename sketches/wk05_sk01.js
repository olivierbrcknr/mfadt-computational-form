// require https://cdn.jsdelivr.net/npm/tweakpane@3.0.7/dist/tweakpane.min.js
// require https://cdn.jsdelivr.net/npm/p5@1.4.0
// Dot Challenge

const pane = new Tweakpane.Pane();

// parameteres
const PARAMS = {
  minDiameter: 4,
  maxDiameter: 20,
  frequency: 0.2,
  seed: 30,
  circleCount: 100,
};

function setup() {
  createCanvas(400, 400);
  colorMode(HSB, 100);
  noLoop();
  noStroke();

  pane.addInput(PARAMS, "minDiameter", {
    min: 0,
    max: 30,
  });
  pane.addInput(PARAMS, "maxDiameter", {
    min: 1,
    max: 50,
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
  pane.addInput(PARAMS, "circleCount", {
    min: 1,
    max: 1000,
  });

  pane.on("change", () => {
    redraw();
  });
}

function draw() {
  background(`rgb(50,50,50)`);
  noiseSeed(PARAMS.seed);

  for (let i = 0; i < PARAMS.circleCount; i++) {
    // seems like Noise Placement
    const x = noise(i * PARAMS.frequency, 0) * width;
    const y = noise(i * PARAMS.frequency, 100) * height;

    // color is dependent on diameter
    // HSB mode -> small = 0; big = 100
    // more green and blue
    // -> diameter has to be center bias
    const diamParam = (random() + random()) / 2;
    const diameter = lerp(PARAMS.minDiameter, PARAMS.maxDiameter, diamParam);
    fill(
      map(diameter, PARAMS.minDiameter, PARAMS.maxDiameter, 0, 100),
      255,
      255
    );

    circle(x, y, diameter);
  }
}
