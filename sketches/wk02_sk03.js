// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

// Inspiration: https://twitter.com/_cel_0/status/1490721677386334216

const grainSize = 1;
const grainDistance = 1.5;
const grainShiftMax = 4;
const iterations = 3;
const drawThreshold = 3; // between 0 and 10
const padding = 20;
const shapeCount = 5;

function setup() {
  createCanvas(600, 600);
  noStroke();
  noLoop();
}

function draw() {
  blendMode(BLEND);
  background("#EDECEA");

  blendMode(MULTIPLY);

  fill("#666");

  for (let b = 0; b < shapeCount; b++) {
    if (random([true, false])) {
      const bW = random(20, width * 0.6);
      const bH = random(20, height * 0.6);

      const bX = random(padding, height - bW - padding);
      const bY = random(padding, width - bH - padding);

      grainBox(bX, bY, bW, bH, 2);
    } else {
      const cD = random(20, min(width * 0.6, height * 0.6));
      const cY = random(padding + cD / 2, height - cD / 2 - padding);
      const cX = random(padding + cD / 2, width - cD / 2 - padding);

      grainCircle(cX, cY, cD, 2);
    }
  }

  fill("#E53030");

  const rBW = random(20, width * 0.4);
  const rBH = random(20, height * 0.4);
  const rBX = random(height - rBW);
  const rBY = random(width - rBH);
  grainBox(rBX, rBY, rBW, rBH, 4);

  const rCD = random(20, min(width * 0.3, height * 0.3));
  const rCY = random(rCD / 2, height - rCD / 2);
  const rCX = random(rCD / 2, width - rCD / 2);
  grainCircle(rCX, rCY, rCD, 3);
}

function grainBox(x, y, w, h, t) {
  push();
  translate(x, y);
  for (let i = 0; i < iterations; i++) {
    for (let row = 0; row < h; row += grainDistance) {
      for (let col = 0; col < w; col += grainDistance) {
        push();

        translate(col, row);

        const xShift = sin((col / w) * PI);
        const yShift = sin((row / h) * PI);

        translate(
          min(
            random(grainShiftMax),
            random(grainShiftMax),
            random(grainShiftMax)
          ),
          min(
            random(grainShiftMax),
            random(grainShiftMax),
            random(grainShiftMax)
          )
        );

        if (random(xShift * 10) < t && random(yShift * 10) < t) {
          circle(0, 0, grainSize);
        }
        pop();
      }
    }
  }
  pop();
}

function grainCircle(x, y, d, t) {
  const radius = d / 2;

  push();
  translate(x, y);

  const circleGrains = map(d, 0, width, 0, 300);

  for (let i = 0; i < iterations; i++) {
    for (let r = 0; r < radius; r += grainDistance) {
      const rMultiply = 1 - r / radius; // radius ~ 0-1
      // const currentCG = map( r, 0, radius, 0, circleGrains) // * sin( (1-r/radius) * PI );
      const currentCG = circleGrains;

      for (let c = 0; c < currentCG; c++) {
        push();

        if (max(random(rMultiply * 10), random(rMultiply * 10)) < t) {
          const cX =
            sin((c / currentCG) * TWO_PI + random(-1, 1) * rMultiply) * r;
          const cY =
            cos((c / currentCG) * TWO_PI + random(-1, 1) * rMultiply) * r;
          circle(cX, cY, grainSize);
        }
        pop();
      }
    }
  }
  pop();
}

// redraw on "Enter"
function keyPressed() {
  if (keyCode === ENTER) {
    redraw();
  }
}
