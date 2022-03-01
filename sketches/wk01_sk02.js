// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js
// Instructions by Nicky Fuganjananon

// You will need a pen, a coloring pencil or highlighter, and paper for this exercise.

// 1. You are not allowed to lift up your pen or pencil until you've completed step 6
// 2. Draw a straight line
// 3. Draw a triangle at the end of the straight line
// 4. Draw another straight line that comes out of one of the triangle's corner
// 5. Draw a circle at the end of the straight line. The circle has to be bigger than the triangle.
// 6. Repeat steps 2-5 until you fill up the page
// Note: the new line you're going to draw next has to be connected to the circle, since you're not lifting up your pen until you fill in the paper
// 7. Color or highlight our 5 favorite circles and 5 favorite triangles.

// You're done! Show me what you've created!

const isDev = false; // adds construction line helpers

const highlightColor = "#FFFFFF";
const backgroundColor = "#0AEBA5";
const lineColor = "#222";

let x1 = 0;
let y1 = 0;

const lineCount = 10;
const highlightCircles = [];
const highlightTriangles = [];

const padding = 60;

function setup() {
  createCanvas(500, 600);
  noFill();
  noLoop();
  stroke(lineColor);

  // create 5 random highlights
  while (highlightCircles.length < 5) {
    const highlightIndex = int(random(lineCount));
    if (!highlightCircles.includes(highlightIndex)) {
      highlightCircles.push(highlightIndex);
    }
  }
  while (highlightTriangles.length < 5) {
    const highlightIndex = int(random(lineCount));
    if (!highlightTriangles.includes(highlightIndex)) {
      highlightTriangles.push(highlightIndex);
    }
  }

  // Generate points to start with
  x1 = random(padding, width - padding * 2);
  y1 = random(padding, height - padding * 2);
}

function draw() {
  // draw a clean background
  blendMode(BLEND);
  background(backgroundColor);
  blendMode(MULTIPLY);

  for (let i = 0; i < lineCount; i++) {
    // 2. draw straight line
    const x2 = random(padding, width - padding);
    const y2 = random(padding, height - padding);

    line(x1, y1, x2, y2);

    // 3. draw triangle
    push();
    if (highlightTriangles.includes(i)) {
      fill(highlightColor);
      blendMode(SCREEN);
    }
    const triangleSideLenght = random(30, 60);
    const triangleEndPoint = drawEqTriangle(x2, y2, triangleSideLenght);
    pop();

    // 4. draw second straight line
    const x3 = triangleEndPoint.x;
    const y3 = triangleEndPoint.y;

    const x4 = random(padding, width - padding);
    const y4 = random(padding, height - padding);

    line(x3, y3, x4, y4);

    // 5. draw bigger circle than triangle
    push();
    if (highlightCircles.includes(i)) {
      fill(highlightColor);
      blendMode(SCREEN);
    }

    const vec1 = createVector(x3, y3);
    const vec2 = createVector(x4, y4);
    const circlePoint = drawCircle(triangleEndPoint.r, vec1, vec2);
    pop();

    x1 = circlePoint.x;
    y1 = circlePoint.y;

    if (isDev) {
      push();
      blendMode(BLEND);
      noStroke();
      fill("blue");
      circle(x1, y1, 3);
      pop();
    }
  }
}

function drawEqTriangle(x1, y1, sideLength) {
  const r = (sqrt(3) / 3) * sideLength;
  const h = (sqrt(3) / 2) * sideLength;

  const x2 = x1 + sideLength / 2;
  const x3 = x1 - sideLength / 2;
  const y2 = y1 + h;

  const angle = random(PI);

  const p2 = rotatePoints(x1, y1, x2, y2, angle);
  const p3 = rotatePoints(x1, y1, x3, y2, angle);

  // show circumfence of triangle
  if (isDev) {
    push();
    noFill();
    stroke(0, 50);
    circle(x1, y1 + r, r * 2);
    pop();
  }

  triangle(x1, y1, p2.x, p2.y, p3.x, p3.y);

  // return values to use them in next element
  return random() > 0.5
    ? { x: p2.x, y: p2.y, r: r }
    : { x: p3.x, y: p3.y, r: r };
}

function drawCircle(minRadius, v1, v2) {
  const radius = random(minRadius, minRadius * 1.2);

  // I wanted to extend the line and put the circle at the end of it, but I did not manage to extend the line as I wanted to
  // const length = v1.dist(v2) + radius;

  const cx = v2.x;
  const cy = v2.y + radius;

  if (isDev) {
    push();
    blendMode(BLEND);
    noStroke();
    fill("red");
    circle(cx, cy, 3);
    // stroke("yellow");
    // line(v1.x, v1.y, cx, cy )
    pop();
  }

  circle(cx, cy, radius * 2);

  // get random point on circle
  const angle = random(PI);
  return rotatePoints(cx, cy, v2.x, v2.y, angle);
}

// https://stackoverflow.com/questions/2259476/rotating-a-point-about-another-point-2d
function rotatePoints(cx, cy, x, y, angle) {
  const cosV = cos(angle);
  const sinV = sin(angle);
  const nx = cosV * (x - cx) + sinV * (y - cy) + cx;
  const ny = cosV * (y - cy) - sinV * (x - cx) + cy;
  return { x: nx, y: ny };
}

function keyPressed() {
  if (keyCode === ENTER) {
    redraw();
  }
}
