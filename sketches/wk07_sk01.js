// require https://cdnjs.cloudflare.com/ajax/libs/paper.js/0.12.15/paper-full.min.js
// require https://cdn.jsdelivr.net/npm/tweakpane@3.0.7/dist/tweakpane.min.js
// require https://cdnjs.cloudflare.com/ajax/libs/chroma-js/2.4.2/chroma.min.js

// parameteres
const PARAMS = {};

const allLines = [];

let bounds = null;
let rectangle = null;

let circle1 = null;
let deltaPosition = null;

const VIEW_HEIGHT = 500;

const LINE_GAP = 10;
const WAVE_WIDTH = 20;
const SINE_PHASE = VIEW_HEIGHT / 22;

let pane = null;
let patternNumber = 0;

const setupTweakPane = () => {
  const pane = new Tweakpane.Pane();

  for (p in PARAMS) {
    pane.addInput(PARAMS, p);
  }

  pane.on("change", () => {
    allLines.forEach((pattern) => {
      pattern.bg.fillColor = PARAMS[pattern.colorKey];
      const c2 = chroma(PARAMS[pattern.colorKey]).darken().hex();
      pattern.lines.forEach((l) => {
        l.strokeColor = c2;
      });
    });
  });
};

const createPattern = (posX, w, c1 = "#E29393", sY = 1.5) => {
  let bounds = null;
  bounds = new paper.Rectangle(
    new paper.Point(posX, 0),
    new paper.Point(posX + w, VIEW_HEIGHT)
  );

  PARAMS[`color_${patternNumber}`] = c1;
  const c2 = chroma(c1).darken().hex();

  const bg = new paper.Path.Rectangle(bounds);
  bg.fillColor = c1;

  const lines = [];

  for (let x = 0; x < bounds.width; x += LINE_GAP) {
    const wiggleLine = new paper.Path();
    wiggleLine.strokeColor = c2;

    let shiftY = 0;
    if (x % (LINE_GAP * 2)) {
      shiftY = sY;
    }

    for (let y = 0; y <= SINE_PHASE; y++) {
      const thisX =
        posX +
        x +
        Math.sin(Math.PI * ((y + shiftY) / 3)) * (WAVE_WIDTH / 2) +
        WAVE_WIDTH / 2;
      wiggleLine.add(new paper.Point(thisX, y * SINE_PHASE));
    }

    wiggleLine.smooth();
    lines.push(wiggleLine);
  }

  allLines.push({
    colorKey: `color_${patternNumber}`,
    number: patternNumber,
    bg: bg,
    lines: lines,
  });

  patternNumber++;
};

window.onload = () => {
  // Get a reference to the canvas object
  const canvas = document.getElementById("myCanvas");

  // Create an empty project and a view for the canvas:
  paper.setup(canvas);

  createPattern(0, 400, "#8EBDC3");
  createPattern(400, 200, "#D8BDA8", 2);
  createPattern(600, 120, "#E29393", 3);

  setupTweakPane();

  // Draw the view now:
  paper.view.draw();
};

const downloadAsSVG = () => {
  // use default name if not provided
  const fileName = "wiggleLine.svg";

  // create a data url of the file
  const svgData = paper.project.exportSVG({ asString: true });
  const url = "data:image/svg+xml;utf8," + encodeURIComponent(svgData);

  // create a link to the data, and "click" it
  const link = document.createElement("a");
  link.download = fileName;
  link.href = url;
  link.click();
};

document.addEventListener("keydown", (e) => {
  if (e.key === "s" || e.key === "S") {
    console.log("download");
    downloadAsSVG();
  }
});
