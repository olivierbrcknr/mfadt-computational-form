// require https://cdn.jsdelivr.net/npm/tweakpane@3.0.7/dist/tweakpane.min.js
// require https://cdn.jsdelivr.net/npm/p5@1.4.0/lib/p5.min.js

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;
const CUBE_POINTS = {};

const pane = new Tweakpane.Pane();

const PARAMS = {
  bg: "#ebebff",
  lineColor: "#000",
  strokeWeight: 1,
  height: 100,
  width: 100,
  depth: 100,
  fill: "#00f4",
  showDimensions: true,
  angle: 30,
};

function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  // angleMode(DEGREES);
  noLoop();
  noFill();

  // add parameters
  pane.addInput(PARAMS, "bg", {
    view: "color",
  });
  pane.addInput(PARAMS, "lineColor", {
    view: "color",
  });
  pane.addInput(PARAMS, "strokeWeight", {
    min: 0.1,
    max: 5,
  });
  pane.addInput(PARAMS, "fill", {
    view: "color",
    alpha: true,
  });
  pane.addInput(PARAMS, "height", {
    min: 0,
    max: height / 2,
  });
  pane.addInput(PARAMS, "width", {
    min: 0,
    max: width / 2,
  });
  pane.addInput(PARAMS, "depth", {
    min: 0,
    max: width / 2,
  });
  pane.addInput(PARAMS, "angle", {
    min: 0,
    max: 45,
  });
  pane.addInput(PARAMS, "showDimensions");

  // redraw
  pane.on("change", function (ev) {
    redraw();
  });
}

function draw() {
  blendMode(BLEND);
  background(PARAMS.bg);

  fill(PARAMS.fill);
  strokeWeight(PARAMS.strokeWeight);
  stroke(PARAMS.lineColor);
  calculatePoints();

  blendMode(MULTIPLY);

  // center cube
  const translateHeight =
    height / 2 +
    PARAMS.height / 2 +
    (PARAMS.width * cos(radians(PARAMS.angle))) / 4 +
    (PARAMS.depth * cos(radians(PARAMS.angle))) / 4;
  const translateWidth =
    width / 2 +
    (PARAMS.width * cos(radians(PARAMS.angle))) / 2 -
    (PARAMS.depth * cos(radians(PARAMS.angle))) / 2;
  translate(translateWidth, translateHeight);

  // lines at back
  drawingContext.setLineDash([1, 4]);

  // bottom left
  line(CUBE_POINTS.x4, CUBE_POINTS.y4, CUBE_POINTS.x2, CUBE_POINTS.y2);

  // bottom right
  line(CUBE_POINTS.x3, CUBE_POINTS.y3, CUBE_POINTS.x2, CUBE_POINTS.y2);

  // back
  line(CUBE_POINTS.x7, CUBE_POINTS.y7, CUBE_POINTS.x2, CUBE_POINTS.y2);

  // front
  drawingContext.setLineDash([]);

  // left side
  quad(
    CUBE_POINTS.x1,
    CUBE_POINTS.y1,
    CUBE_POINTS.x5,
    CUBE_POINTS.y5,
    CUBE_POINTS.x8,
    CUBE_POINTS.y8,
    CUBE_POINTS.x4,
    CUBE_POINTS.y4
  );

  // top side
  quad(
    CUBE_POINTS.x5,
    CUBE_POINTS.y5,
    CUBE_POINTS.x6,
    CUBE_POINTS.y6,
    CUBE_POINTS.x7,
    CUBE_POINTS.y7,
    CUBE_POINTS.x8,
    CUBE_POINTS.y8
  );

  // right side
  quad(
    CUBE_POINTS.x1,
    CUBE_POINTS.y1,
    CUBE_POINTS.x3,
    CUBE_POINTS.y3,
    CUBE_POINTS.x6,
    CUBE_POINTS.y6,
    CUBE_POINTS.x5,
    CUBE_POINTS.y5
  );

  // add shadow on the side
  push();
  fill(0, 100);
  quad(
    CUBE_POINTS.x1,
    CUBE_POINTS.y1,
    CUBE_POINTS.x3,
    CUBE_POINTS.y3,
    CUBE_POINTS.x6,
    CUBE_POINTS.y6,
    CUBE_POINTS.x5,
    CUBE_POINTS.y5
  );
  pop();

  // dimensions
  if (PARAMS.showDimensions) {
    dimensionLine("width");
    dimensionLine("height");
    dimensionLine("depth");
  }
}

const calculatePoints = () => {
  //        7
  //    8       6
  //        5
  //
  //        2
  //    4       3
  //        1

  // front bottom center
  CUBE_POINTS.x1 = 0;
  CUBE_POINTS.y1 = 0;

  // right bottom
  CUBE_POINTS.x3 = PARAMS.depth * cos(radians(PARAMS.angle));
  CUBE_POINTS.y3 = -PARAMS.depth * sin(radians(PARAMS.angle));

  // left bottom
  CUBE_POINTS.x4 = -PARAMS.width * cos(radians(PARAMS.angle));
  CUBE_POINTS.y4 = -PARAMS.width * sin(radians(PARAMS.angle));

  // front top center
  CUBE_POINTS.x5 = 0;
  CUBE_POINTS.y5 = -PARAMS.height;

  // right top
  CUBE_POINTS.x6 = CUBE_POINTS.x3;
  CUBE_POINTS.y6 = CUBE_POINTS.y3 - PARAMS.height;

  // left top
  CUBE_POINTS.x8 = CUBE_POINTS.x4;
  CUBE_POINTS.y8 = CUBE_POINTS.y4 - PARAMS.height;

  // back bottom center
  CUBE_POINTS.x2 = CUBE_POINTS.x3 + CUBE_POINTS.x4;
  CUBE_POINTS.y2 = CUBE_POINTS.y3 + CUBE_POINTS.y4;

  // center back top
  CUBE_POINTS.x7 = CUBE_POINTS.x2;
  CUBE_POINTS.y7 = CUBE_POINTS.y2 - PARAMS.height;
};

const dimensionLine = (type = "width") => {
  push();
  let x1 = 0;
  let y1 = 0;
  let x2 = 0;
  let y2 = 0;

  switch (type) {
    case "width":
      x1 = CUBE_POINTS.x1;
      y1 = CUBE_POINTS.y1;
      x2 = CUBE_POINTS.x4;
      y2 = CUBE_POINTS.y4;
      translate(-20, 20);
      break;
    case "height":
      x1 = CUBE_POINTS.x3;
      y1 = CUBE_POINTS.y3;
      x2 = CUBE_POINTS.x6;
      y2 = CUBE_POINTS.y6;
      translate(20, 0);
      break;
    case "depth":
      x1 = CUBE_POINTS.x1;
      y1 = CUBE_POINTS.y1;
      x2 = CUBE_POINTS.x3;
      y2 = CUBE_POINTS.y3;
      translate(20, 20);
      break;
  }

  line(x1, y1, x2, y2);

  // label
  push();
  let xT = lerp(x1, x2, 0.5);
  let yT = lerp(y1, y2, 0.5);

  switch (type) {
    case "width":
      // rotate( radians( PARAMS.angle ) );
      textAlign(CENTER);
      translate(-10, 20);
      break;
    case "height":
      // rotate( -HALF_PI );
      translate(5, 0);
      break;
    case "depth":
      // rotate( -radians( PARAMS.angle ) );
      textAlign(CENTER);
      translate(10, 20);
      break;
  }
  noStroke();
  fill(PARAMS.lineColor);
  text(`${type}: ${int(PARAMS.width)}`, xT, yT);
  pop();

  pop();
};
