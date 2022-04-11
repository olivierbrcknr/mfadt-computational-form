// require https://cdn.jsdelivr.net/npm/tweakpane@3.0.7/dist/tweakpane.min.js
// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js
// require /turtles/turtle/turtle.js

const pane = new Tweakpane.Pane();

const PARAMS = {
  generations: 8,
  lineLenght: 10,
  adjustAngle: 0,
  system: 0,
};

let currentStep = 0;
let startString = "";
let drawString = "";
let t = null;

function setup() {
  createCanvas(800, 800);

  frameRate(1);

  pane.addInput(PARAMS, "generations", {
    step: 1,
    min: 1,
    max: 12,
  });
  pane.addInput(PARAMS, "system", {
    options: {
      "Sierpinski triangle": 0,
      "Sierpiński arrowhead curve": 1,
      "Koch curve": 2,
    },
  });

  pane.addInput(PARAMS, "lineLenght", {
    min: 1,
    max: 50,
  });
  pane.addInput(PARAMS, "adjustAngle", {
    min: -90,
    max: 90,
  });

  pane.on("change", adjustValues);

  t = new Turtle();
  adjustValues();
}

const adjustValues = () => {
  currentStep = 0;
  loop();

  switch (PARAMS.system) {
    // Sierpinski triangle
    case 0:
      startString = "F-G-G";
      break;
    // Sierpiński arrowhead curve
    case 1:
      startString = "F";
      break;
    // Koch curve
    case 2:
      startString = "F";
      break;
  }

  drawString = startString;
};

const applyLSystem = (string) => {
  let newString = "";

  switch (PARAMS.system) {
    // Sierpinski triangle
    case 0:
      // Taken from Wikipedia
      /*
      variables : F G
      constants : + −
      start  : F−G−G
      rules  : (F → F−G+F+G−F), (G → GG)
      angle  : 120°
      */
      newString = string.split("").map((c) => {
        switch (c) {
          case "F":
            return "F-G+F+G-F";
            break;
          case "G":
            return "GG";
            break;
          default:
            return c;
            break;
        }
      });

      break;
    // Sierpiński arrowhead curve
    case 1:
      newString = string.split("").map((c) => {
        switch (c) {
          case "F":
            return "G-F-G";
            break;
          case "G":
            return "F+G+F";
            break;
          default:
            return c;
            break;
        }
      });

      break;
    // Koch curve
    case 2:
      newString = string.split("").map((c) => {
        switch (c) {
          case "F":
            return "F+F-F-F+F";
            break;
          default:
            return c;
            break;
        }
      });
      break;
  }

  return newString.join("");
};

const drawLSystem = (string) => {
  let L_SYSTEM_ANGLE = 0;

  switch (PARAMS.system) {
    // Sierpinski triangle
    case 0:
    case 1:
      L_SYSTEM_ANGLE = (PARAMS.system === 0 ? 120 : 60) + PARAMS.adjustAngle;

      for (let i = 0; i < string.length; i++) {
        switch (string.charAt(i)) {
          case "F":
          case "G":
            t.moveForward(PARAMS.lineLenght);
            // console.log("moved forward")
            break;
          case "+":
            t.turnLeft(L_SYSTEM_ANGLE);
            // console.log("turned left")
            break;
          case "-":
            t.turnRight(L_SYSTEM_ANGLE);
            // console.log("turned right")
            break;
        }
      }

      break;
    case 2:
      L_SYSTEM_ANGLE = 90 + PARAMS.adjustAngle;

      for (let i = 0; i < string.length; i++) {
        switch (string.charAt(i)) {
          case "F":
            t.moveForward(PARAMS.lineLenght);
            // console.log("moved forward")
            break;
          case "+":
            t.turnLeft(L_SYSTEM_ANGLE);
            // console.log("turned left")
            break;
          case "-":
            t.turnRight(L_SYSTEM_ANGLE);
            // console.log("turned right")
            break;
        }
      }

      break;
  }
};

function draw() {
  background("black");
  stroke("white");
  noFill();

  t.penUp();
  t.moveTo(50, height / 2);
  t.turnTo(0);
  t.penDown();

  // let drawString = startString;

  // for (let i = 0; i < currentStep; i++) {
  drawLSystem(drawString);
  drawString = applyLSystem(drawString);
  // }

  currentStep++;

  // end drawing
  if (currentStep >= PARAMS.generations) {
    noLoop();
  }
}
