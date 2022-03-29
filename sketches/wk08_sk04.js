// require https://cdn.jsdelivr.net/npm/p5@1.4.0/lib/p5.js
// require https://cdn.jsdelivr.net/npm/tweakpane@3.0.7/dist/tweakpane.min.js
// require /turtles/turtle/turtle.js

const PARAMS = {
  width: 100,
  height: 100,
  margin: 20,
  useCurve: true,
  radiusSegments: 10,
};

const pane = new Tweakpane.Pane();

// start sketch
let t = null;

function setup() {
  createCanvas(500, 500);
  t = new Turtle();

  pane.addInput(PARAMS, "width", {
    min: 1,
    max: width,
  });
  pane.addInput(PARAMS, "height", {
    min: 1,
    max: height,
  });
  pane.addInput(PARAMS, "margin", {
    min: 2,
    max: 100,
  });
  pane.addInput(PARAMS, "useCurve");
  pane.addInput(PARAMS, "radiusSegments", {
    step: 1,
    min: 1,
    max: 20,
  });

  pane.on("change", () => {
    redraw();
  });

  noLoop();
}

function draw() {
  background(255);

  t.penUp();
  t.moveTo((width - PARAMS.width) / 2, (height - PARAMS.height) / 2);
  t.penDown();

  t.turnTo(90);

  const maxLine = int(PARAMS.width / PARAMS.margin);

  const radius = PARAMS.margin / 2;
  const turnDistance = radius * sin(PI / PARAMS.radiusSegments);

  if (PARAMS.useCurve) {
    t.moveForward(radius);
  }

  for (let w = 0; w <= maxLine; w++) {
    if (PARAMS.useCurve) {
      t.moveForward(PARAMS.height - radius * 2);

      if (w < maxLine) {
        for (let r = 0; r < PARAMS.radiusSegments; r++) {
          if (w % 2 === 0) {
            t.turnLeft(180 / PARAMS.radiusSegments);
          } else {
            t.turnRight(180 / PARAMS.radiusSegments);
          }
          t.moveForward(turnDistance);
        }
      } else {
        t.moveForward(radius);
      }
    } else {
      t.moveForward(PARAMS.height);

      if (w < maxLine) {
        if (w % 2 !== 0) {
          t.turnRight(90);
        } else {
          t.turnLeft(90);
        }

        t.moveForward(PARAMS.margin);

        if (w % 2 !== 0) {
          t.turnRight(90);
        } else {
          t.turnLeft(90);
        }
      }
    }
  }
}
