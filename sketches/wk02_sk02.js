// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

const bgColors = [
  "#F8F1DD",
  "#D3BB9D",
  "#CCD2D7",
  "#C7E2F6",
  "#FAA1A1",
  "#2B2361",
];
const windowColumns = 3;
const windowRows = 5;

function setup() {
  createCanvas(600, 800);

  noLoop();
}

function draw() {
  // set colors
  const bgColor = random(bgColors);
  const colorLight = lerpColor(color(bgColor), color(255), random(0.2, 0.4));
  const colorDark = lerpColor(color(bgColor), color(0), random(0.2, 0.4));

  background(bgColor);
  noStroke();

  // shift to bottom to build up
  translate(width / 2 + width * random(-0.1, 0.1), height);
  const b1_Height = height * random(0.6, 0.8);
  const b1_Width = width * random(0.5, 0.7);
  const b1_Ratio = (random(0.2, 0.8) + random(0.2, 0.8)) / 2;

  // draw BG part of building
  drawBuilding(colorLight, colorDark, bgColor, b1_Height, b1_Width, b1_Ratio);

  /*
  translate( width * random( -0.1, 0.1 ), 0 );
  // draw Front part of building
  const b2_Height = min( random( 0.4*height, b1_Height ), random( 0.4*height, b1_Height ));
  const b2_Width = random( b1_Width, width*0.7 );
  // const b2_Ratio = random( 0.3, 0.7 );
  drawBuilding(colorLight,colorDark,bgColor,b2_Height,b2_Width,b1_Ratio);
  */
}

function drawBuilding(cLight, cDark, cBG, h, w, ratio) {
  const centerShift = w * (0.5 - ratio);

  const left = -w / 2;
  const shiftLeft = h * 0.1;

  const right = w / 2;
  const shiftRight = h * 0.1;

  fill(cLight);

  beginShape();
  vertex(left, 0);
  vertex(left, (h - shiftLeft) * -1);
  vertex(0 + centerShift, h * -1);
  vertex(0 + centerShift, 0);
  endShape();

  fill(cDark);

  beginShape();
  vertex(right, 0);
  vertex(right, (h - shiftRight) * -1);
  vertex(0 + centerShift, h * -1);
  vertex(0 + centerShift, 0);
  endShape();

  let winH = h / windowRows;
  winH = winH * max(random(0.6, 1.5), random(0.6, 1.5));

  push();
  translate(left, 0);
  const wallWidth1 = abs(left - centerShift);
  drawWindows(wallWidth1, winH, h, cLight, cBG, shiftLeft);

  translate(left * -1 + centerShift, 0);
  const wallWidth2 = abs(right - centerShift);
  drawWindows(wallWidth2, winH, h, cDark, cBG, shiftRight, true);
  pop();
}

function drawWindows(
  wallWidth,
  winH,
  buildingH,
  c1,
  c2,
  shift,
  isRight = false
) {
  let windowMargin = wallWidth * 0.05;
  const winW = wallWidth / windowColumns - windowMargin / 2;

  for (let col = 0; col < windowColumns; col++) {
    for (let row = 0; row < windowRows; row++) {
      fill(lerpColor(color(c1), color(c2), random()));

      if (random() < 0.6) {
        const x1 = winW * col + windowMargin;
        const x2 = x1 + winW - windowMargin;

        const yOffset = isRight
          ? lerp(0, shift, x1 / wallWidth)
          : lerp(shift, 0, x1 / wallWidth);
        const yOffset2 = isRight
          ? lerp(0, shift, x2 / wallWidth)
          : lerp(shift, 0, x2 / wallWidth);

        const y1 = -buildingH + yOffset + winH * row + windowMargin;
        const y2 = y1 + winH - windowMargin;
        const y4 = -buildingH + yOffset2 + winH * row + windowMargin;
        const y3 = y4 + winH - windowMargin;

        beginShape();
        vertex(x1, y1);
        vertex(x1, y2);
        vertex(x2, y3);
        vertex(x2, y4);
        endShape();
      }
    }
  }
}

function keyPressed() {
  if (keyCode === ENTER) {
    redraw();
  }
}
