// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

const pathPoints = 60;
const distance = 20;
const paths = 400 / distance;

const bgColor = "#E2E7EB";
const lineColor = "#EB6774";

let lineWidth = 0;

const lineHeights = [];

let renderCount = 0;
let renderCountIncrement = 1;
const renderCountMax = 200;
const maxAmplitude = 200;
const baseLineAmplitude = 5;

function setup() {
  createCanvas(600, 600);
  lineWidth = width * 0.6;

  frameRate(15);
  stroke(lineColor);
  noFill();

  for (let i = 0; i < paths; i++) {
    lineHeights.push(1);
  }
}

function draw() {
  background(bgColor);

  translate(width / 2 - lineWidth * 0.78, height / 5);

  for (let i = 0; i < paths; i++) {
    translate(distance / 2, distance);

    beginShape();
    for (let p = 0; p < pathPoints; p++) {
      let pRatio = p / pathPoints;

      let pX = pRatio * lineWidth;

      let multiplicator = (sin(pRatio * TWO_PI - HALF_PI) + 1) / 2;

      multiplicator = pow(multiplicator, 6);

      // , lineHeights[i] * 0.1

      // let pY = noise( p * lineHeights[i] * 0.03 ) * baseLineAmplitude;
      // noiseDetail(lineHeights[i], p );

      let pY =
        noise(lineHeights[i] * 0.1, p * 0.08) * multiplicator * maxAmplitude;
      pY += (noise(p, lineHeights[i]) - 0.5) * baseLineAmplitude;

      vertex(pX, -pY);
    }
    endShape();
  }

  lineHeights.pop();
  lineHeights.unshift(renderCount);

  renderCount += renderCountIncrement;
  if (renderCount >= renderCountMax) {
    renderCountIncrement = -1;
  } else if (renderCount <= 0) {
    renderCountIncrement = 1;
  }
}
