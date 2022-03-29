// require https://cdn.jsdelivr.net/npm/p5@1.4.0/lib/p5.js
// require https://cdn.jsdelivr.net/npm/tweakpane@3.0.7/dist/tweakpane.min.js
// require /turtles/turtle/turtle.js

// Pair Challenge with Shayla

const PARAMS = {
  treeColor: "rgba(175, 225, 175, 0.5)",
  numberOfTrees: 15,
  numberOfTreeSegments: 5,
  numberOfBushes: 10,
  pathFrequency: 3,
  pathAmplitude: 0.3,
};

const pane = new Tweakpane.Pane();
let t = null;
const trees = [];
const bushes = [];

function setup() {
  createCanvas(800, 500);
  t = new Turtle();

  const f1 = pane.addFolder({
    title: "Trees",
  });
  f1.addInput(PARAMS, "treeColor", {
    view: "color",
  });
  f1.addInput(PARAMS, "numberOfTrees", {
    step: 1,
    min: 0,
    max: 50,
  });
  f1.addInput(PARAMS, "numberOfTreeSegments", {
    step: 1,
    min: 3,
    max: 8,
  });

  const f3 = pane.addFolder({
    title: "Bushes",
  });
  f3.addInput(PARAMS, "numberOfBushes", {
    step: 1,
    min: 0,
    max: 50,
  });

  const f2 = pane.addFolder({
    title: "Path",
  });
  f2.addInput(PARAMS, "pathFrequency", {
    min: 0,
    max: 10,
  });
  f2.addInput(PARAMS, "pathAmplitude", {
    min: 0,
    max: 2,
  });

  pane.on("change", () => {
    generateTrees(PARAMS.numberOfTrees);
    generateBushes(PARAMS.numberOfBushes);
    redraw();
  });

  generateTrees(PARAMS.numberOfTrees);
  generateBushes(PARAMS.numberOfBushes);

  noLoop();
}

function draw() {
  background("#F3EDDF");

  for (let i = 0; i < trees.length; i++) {
    const tree = trees[i];
    drawTree(tree.x, tree.y, tree.r);
  }

  for (let i = 0; i < bushes.length; i++) {
    const bush = bushes[i];
    drawBush(bush.x, bush.y, bush.r);
  }

  drawPath();
}

const generateTrees = (num) => {
  trees.splice(0, trees.length);

  for (let i = 0; i < num; i++) {
    trees.push({
      x: random(width),
      y: random(height),
      r: random(30, 80),
    });
  }
};

const generateBushes = (num) => {
  bushes.splice(0, bushes.length);

  for (let i = 0; i < num; i++) {
    bushes.push({
      x: random(width),
      y: random(height),
      r: random(10, 40),
    });
  }
};

const drawTree = (x, y, r) => {
  push();

  blendMode(MULTIPLY);
  noStroke();
  fill(PARAMS.treeColor);
  circle(x, y, r * 2);
  pop();

  stroke("#013214");

  for (let segment = 0; segment < PARAMS.numberOfTreeSegments; segment++) {
    drawSegment(x, y, (360 / PARAMS.numberOfTreeSegments) * segment);
  }

  function drawSegment(x, y, angle) {
    t.penUp();
    t.moveTo(x, y);
    t.turnTo(angle);
    t.penDown();
    // length of first branch (should be based on radius of tree circle)
    // tree radius
    const branchLength = r / 4;
    drawBranch(branchLength);
    t.penUp();
  }

  function drawBranch(length) {
    const distToCenter = dist(x, y, t.x, t.y);

    if (distToCenter - r > 0 || length < 4) {
      return;
    }

    // draw this branch
    t.moveForward(length);

    // left child
    t.pushState();
    t.turnLeft(30 + random(-10, 10));
    // good range * 0.75 to 0.85
    drawBranch(length * 0.85);
    t.popState();

    // right child
    t.pushState();
    t.turnRight(30 + random(-10, 10));
    // good range * 0.75 to 0.85
    drawBranch(length * 0.85);
    t.popState();
  }
};

const drawBush = (x, y, r) => {
  t.penUp();
  t.moveTo(x, y);
  t.turnTo(-90);

  t.moveForward(r);
  t.penDown();

  const distanceBetweenPoints = 20;

  const circ = 2 * PI * r;
  const steps = int(circ / distanceBetweenPoints);
  const rotAngle = 120;

  for (let i = 0; i < steps; i++) {
    t.turnRight(360 / steps);
    t.turnLeft(rotAngle);
    for (let j = 0; j < distanceBetweenPoints; j++) {
      t.turnRight((1 / distanceBetweenPoints) * rotAngle);
      t.moveForward(1);
    }
  }
};

const drawPath = () => {
  t.penUp();
  t.moveTo(random(100, width - 100), height);
  t.turnTo(-90);
  t.penDown();

  let turnAngle = 0;
  let turnCount = 0;

  while (t.y > 0 && turnCount < 500) {
    turnAngle = sin((t.y / height) * TWO_PI) * PARAMS.pathAmplitude;

    t.turnLeft(turnAngle);
    t.moveForward(5);

    turnCount++;
  }

  // draw the second thing
  t.turnTo(0);
  t.moveForward(random(50, 150));
  t.turnTo(90);

  turnCount = 0;
  while (t.y < height && turnCount < 500) {
    turnAngle = sin((t.y / height) * TWO_PI) * PARAMS.pathAmplitude * -1;

    t.turnLeft(turnAngle);
    t.moveForward(5);

    turnCount++;
  }
};
