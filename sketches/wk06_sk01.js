// require https://cdn.jsdelivr.net/npm/tweakpane@3.0.7/dist/tweakpane.min.js
// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

const pane = new Tweakpane.Pane();

// parameteres
const PARAMS = {
  pixelCount: 33,
  radius: 0.5,
  strokeWidth: 12,
  showVector: false,
};

const CIRCLE_POINTS = 100;

let myImg = null;

function setup() {
  createCanvas(400, 400);

  pane.addInput(PARAMS, "pixelCount", {
    step: 1,
    min: 1,
    max: 100,
  });
  pane.addInput(PARAMS, "radius", {
    min: 0,
    max: 1,
  });
  pane.addInput(PARAMS, "strokeWidth", {
    min: 0,
    max: 20,
  });
  pane.addInput(PARAMS, "showVector");

  pane.on("change", () => {
    redraw();
  });

  noLoop();
  noSmooth();
}

function draw() {
  background(0);

  noiseSeed(PARAMS.seed);

  myImg = createImage(PARAMS.pixelCount, PARAMS.pixelCount);
  myImg.loadPixels();

  const cRadius = (PARAMS.radius / 2) * PARAMS.pixelCount;
  const sW = ((PARAMS.strokeWidth / width) * PARAMS.pixelCount) / 2;

  for (let y = 0; y < myImg.height; y++) {
    for (let x = 0; x < myImg.width; x++) {
      let isInCircle = false;

      for (let t = 0; t <= CIRCLE_POINTS; t++) {
        const cx =
          cos((t / CIRCLE_POINTS) * TWO_PI) * cRadius + PARAMS.pixelCount / 2;
        const cy =
          sin((t / CIRCLE_POINTS) * TWO_PI) * cRadius + PARAMS.pixelCount / 2;
        if (x <= cx + sW && x >= cx - sW && y <= cy + sW && y >= cy - sW) {
          isInCircle = true;
        }
      }

      const isBlack = isInCircle;
      setQuick(myImg, x, y, isBlack);
    }
  }

  myImg.updatePixels();

  image(myImg, 0, 0, width, height);

  if (PARAMS.showVector) {
    push();

    stroke("red");
    strokeWeight(1);
    noFill();

    translate(width / 2, height / 2);
    circle(0, 0, ((cRadius * width) / PARAMS.pixelCount) * 2);

    pop();
  }
}

function setQuick(img, x, y, black) {
  const i = (y * img.width + x) * 4;
  img.pixels[i + 0] = black ? 0 : 255;
  img.pixels[i + 1] = black ? 0 : 255;
  img.pixels[i + 2] = black ? 0 : 255;
  img.pixels[i + 3] = black ? 0 : 255;
}
