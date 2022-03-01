// require https://cdn.jsdelivr.net/npm/tweakpane@3.0.7/dist/tweakpane.min.js
// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

const pane = new Tweakpane.Pane();

// constants
const FR = 30;
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;

// parameteres
const PARAMS = {
  diameter: CANVAS_WIDTH / 2,
  margin: 10,
  speed: 0.3,
  angle: 30,
  circlePoints: 60,
  strokeWeight: 0.6,
  seed: 20,
  useDiameterNoise: true,
  dNoiseAmplitude: 2,
  dNoiseFrequency: 0.01,
  useShapeNoise: true,
  sNoiseAmplitude: 0.5,
  sNoiseFrequency: 0.08,
};

// global variables that are needed
let cutCount = 0;
let sphere_counter = 0;

function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  stroke(255);
  noFill();
  frameRate(FR);

  // add parameters
  const f1 = pane.addFolder({
    title: "Base Shape",
  });
  f1.addInput(PARAMS, "diameter", {
    min: 0,
    max: CANVAS_WIDTH,
  });
  f1.addInput(PARAMS, "margin", {
    min: 2,
    max: 100,
  });
  f1.addInput(PARAMS, "angle", {
    min: 0,
    max: 45,
  });
  f1.addInput(PARAMS, "circlePoints", {
    step: 1,
    min: 0,
    max: 100,
  });
  f1.addInput(PARAMS, "strokeWeight", {
    min: 0,
    max: 2,
  });
  const f2 = pane.addFolder({
    title: "Animation",
  });
  f2.addInput(PARAMS, "speed", {
    min: 0,
    max: 3,
  });
  f2.addInput(PARAMS, "seed", {
    step: 1,
    min: 0,
    max: 999,
  });
  const f3 = pane.addFolder({
    title: "Diameter Noise",
  });
  f3.addInput(PARAMS, "useDiameterNoise");
  f3.addInput(PARAMS, "dNoiseAmplitude", {
    min: 0,
    max: 10,
  });
  f3.addInput(PARAMS, "dNoiseFrequency", {
    step: 0.001,
    min: 0,
    max: 0.05,
  });
  const f4 = pane.addFolder({
    title: "Shape Noise",
  });
  f4.addInput(PARAMS, "useShapeNoise");
  f4.addInput(PARAMS, "sNoiseAmplitude", {
    min: 0,
    max: 1,
  });
  f4.addInput(PARAMS, "sNoiseFrequency", {
    step: 0.001,
    min: 0,
    max: 0.1,
  });

  adjustValues();
  pane.on("change", adjustValues);
}

function adjustValues() {
  cutCount = int(PARAMS.diameter / PARAMS.margin);
  strokeWeight(PARAMS.strokeWeight);
  noiseSeed(PARAMS.seed);
}

function draw() {
  background(0);

  const tX = sphere_counter * PARAMS.speed;
  const p_now = tX / PARAMS.margin;
  if (tX > PARAMS.margin) {
    sphere_counter = 0;
  }
  translate(width / 2 - PARAMS.diameter / 2 - PARAMS.margin / 2, height / 2);

  for (let i = 0; i < cutCount; i++) {
    const p = lerp(i / cutCount, (i + 1) / cutCount, p_now);
    const sliceCut = lerp(0, PARAMS.diameter, p);
    const radius = sqrt(PARAMS.diameter * sliceCut - pow(sliceCut, 2));

    const h = radius * 2;
    const d = radius * 2 * cos(radians(90 - PARAMS.angle));

    translate(PARAMS.margin, 0);

    const dn = PARAMS.useDiameterNoise
      ? noise(PARAMS.dNoiseFrequency * frameCount, p) * PARAMS.dNoiseAmplitude
      : 1;

    // draw circle
    beginShape();
    for (let c = 0; c <= PARAMS.circlePoints; c++) {
      let x = ((sin((c / PARAMS.circlePoints) * TWO_PI) * d) / 2) * dn;
      let y = ((cos((c / PARAMS.circlePoints) * TWO_PI) * h) / 2) * dn;

      if (PARAMS.useShapeNoise) {
        const n2 =
          sin(p * PI) *
          PARAMS.sNoiseAmplitude *
          (noise(frameCount * 0.01, PARAMS.sNoiseFrequency * c) - 0.5);
        x += n2 * d;
        y += n2 * h;
      }

      x += tX;

      curveVertex(x, y);
    }
    endShape(CLOSE);
  }
  sphere_counter++;
}
