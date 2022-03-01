// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

// inspired by
// https://www.hustwit.com/subwaydebate
// this card: https://images.squarespace-cdn.com/content/v1/59d29824b1ffb6ce197f5392/1621308783655-L8F891I57ZZZSM5AKP4K/SD_PRINT_text.jpg?format=2500w

const ratio = 5 / 7; // regular card ratio
const ppi = 110;
const cardHeigth = 7 * ppi; // in inches

const lineWidth = 0.04 * ppi;
const lineOffset = 0.01 * ppi;

let totalClassicLines = 0;
let totalNewLines = 0;

const colors = {
  red: "#E01E1F",
  bg: "#F2F1EC",
  black: "#1C1314",
};

function setup() {
  createCanvas(cardHeigth * ratio, cardHeigth);
  noLoop();

  noFill();
  strokeWeight(lineWidth);

  textFont("Courier New");
  textStyle(BOLD);
  textSize(ppi / 10);
}

function draw() {
  background(colors.bg);

  // draw lines until at least 16 black lines are drawn
  while (totalClassicLines < 16) {
    drawClassicLine();
  }

  // draw lines until at least 8 red lines are drawn
  while (totalNewLines < 8) {
    drawNewLine();
  }

  push();
  noStroke();
  fill(colors.red);
  text(
    `The Comp Form
Subway Map Generation
#${getRandomID()}
January 31, 2022`,
    0.3 * ppi,
    height - 0.8 * ppi
  );
  pop();
}

function getRandomID() {
  let idString = "";
  for (let r = 0; r < 10; r++) {
    idString += int(random(0, 10)).toString();
  }
  return idString;
}

function drawClassicLine() {
  stroke(colors.black);

  const numberOfLines = int(random(1, 5));
  totalClassicLines += numberOfLines;

  // generate LinePoints
  const points = [];

  // get starting point
  let lastX = random(width);
  points.push({
    x: lastX,
    y: 0,
  });

  let lastY = 0;

  // how many turns
  for (let t = 0; t < int(random(1, 4)); t++) {
    const newY = random(lastY, height);

    // point down
    points.push({
      x: lastX,
      y: newY,
    });

    lastY = newY;
    const newX = random(lastX, width);

    // point right
    points.push({
      x: newX,
      y: lastY,
    });

    lastX = newX;
  }

  // get end point
  const finalY = random(lastY, height);
  points.push({
    x: lastX,
    y: finalY,
  });
  points.push({
    x: width,
    y: finalY,
  });

  // draw multiple lines if they go along
  for (let l = 0; l < numberOfLines; l++) {
    beginShape();
    for (p in points) {
      const x = points[p].x + (lineWidth + lineOffset) * l;
      const y = points[p].y - (lineWidth + lineOffset) * l;
      vertex(x, y);
    }
    endShape();
  }
}

function drawNewLine() {
  stroke(colors.red);
  totalNewLines++;

  // generate LinePoints
  const points = [];

  // get starting point

  let lastX = random(width / 2);
  points.push({
    x: lastX,
    y: 0,
  });

  let lastY = random(height / 2);

  // how many turns
  for (let t = 0; t < int(random(1, 4)); t++) {
    // give a little bit of extra space on top
    const newY = random(lastY, lastY * 1.3 > height ? height : lastY * 1.3);
    const newX = random(lastX - lastX * 0.2, width);
    // point down
    points.push({
      x: newX,
      y: newY,
    });
    lastY = newY;
    lastX = newX;
  }

  // get end point
  const finalY = random(lastY - lastY * 0.2, height);
  points.push({
    x: lastX,
    y: finalY,
  });
  points.push({
    x: width,
    y: finalY,
  });

  beginShape();
  for (let p = 0; p < points.length; p++) {
    const x = points[p].x;
    const y = points[p].y;
    curveVertex(x, y);

    // we need the point twice if it is the beginning or end point for the curve vertex to work
    if (p === 0 || p === points.length - 1) {
      const x = points[p].x;
      const y = points[p].y;
      curveVertex(x, y);
    }
  }
  endShape();
}

function keyPressed() {
  if (keyCode === ENTER) {
    totalClassicLines = 0;
    totalNewLines = 0;
    redraw();
  }
}
