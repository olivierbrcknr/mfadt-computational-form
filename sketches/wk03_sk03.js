// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js
// Pair Challenge with Billy Ho

let lineCount = 0;
const margin = 3;
const pointCount = 10;
let maxAmplitude = 0.2;

// the point of Billy's "cross"
let pX = 0;
let pY = 0;

function setup() {
  createCanvas(430, 400);

  maxAmplitude = height * maxAmplitude;

  lineCount = (height + maxAmplitude) / margin;

  noFill();
  stroke("#00f");
  strokeWeight(0.4);

  pX = width * 0.5;
  pY = height * 0.7;

  noLoop();
}

function draw() {
  background(0);

  translate(0, -1 * maxAmplitude);

  for (let l = 0; l < lineCount; l++) {
    beginShape();

    for (let i = 0; i <= pointCount; i++) {
      const tX = map(i, 0, pointCount, 0, width);
      const tY = l * margin;
      let n = noise(i * 2, l * 0.1);

      n *= map(dist(pX, pY, tX, tY), 0, width * 0.8, 0, 1);

      let double = 1;
      if (i === 0 || i === pointCount) {
        double = 2;
      }

      for (let d = 0; d < double; d++) {
        curveVertex(tX, n * maxAmplitude + tY);
      }
    }
    endShape();
  }
}
