// require https://cdn.jsdelivr.net/npm/tweakpane@3.0.7/dist/tweakpane.min.js
// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

// inspired by Lagoon — Laura Misch

const pane = new Tweakpane.Pane();

// parameteres
const PARAMS = {
  pixelCount: 30,
  circleRadius: 80,
  background: "#1C0571",
  color1: "#090BC2",
  color2: "#D37295",
  color3: "#A98A2F",
  midPoint: 0.5,
  frequencyX: 10,
  frequencyY: 5,
  seed: 200,
  isAnimated: false,
};

let count = 1;

let myImg = null;

function setup() {
  createCanvas(600, 600);

  frameRate(10);

  const f1 = pane.addFolder({
    title: "Lagoon",
  });
  f1.addInput(PARAMS, "pixelCount", {
    step: 1,
    min: 1,
    max: 200,
  });
  f1.addInput(PARAMS, "circleRadius", {
    min: 1,
    max: 100,
  });
  f1.addInput(PARAMS, "background", {
    view: "color",
  });
  f1.addInput(PARAMS, "color1", {
    view: "color",
  });
  f1.addInput(PARAMS, "color2", {
    view: "color",
  });
  f1.addInput(PARAMS, "color3", {
    view: "color",
  });
  f1.addInput(PARAMS, "midPoint", {
    min: 0,
    max: 1,
  });

  const f2 = pane.addFolder({
    title: "Noise",
  });
  f2.addInput(PARAMS, "frequencyX", {
    step: 0.001,
    min: 0,
    max: 20,
  });
  f2.addInput(PARAMS, "frequencyY", {
    step: 0.001,
    min: 0,
    max: 20,
  });
  f2.addInput(PARAMS, "seed", {
    min: 0,
    max: 1000,
  });

  const f3 = pane.addFolder({
    title: "Animation",
  });
  f3.addInput(PARAMS, "isAnimated");

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

  for (let y = 0; y < myImg.height; y++) {
    for (let x = 0; x < myImg.width; x++) {
      let isInCircle =
        dist(x + 0.5, y + 0.5, myImg.width / 2, myImg.height / 2) <
        ((PARAMS.pixelCount / 2) * PARAMS.circleRadius) / 100;

      let c = null;

      // draw lagoon
      if (isInCircle) {
        let n = noise(
          (PARAMS.frequencyX * x) / myImg.width + count / 10,
          (PARAMS.frequencyY * y) / myImg.height + count / 30
        );

        n *= n;

        if (n <= PARAMS.midPoint) {
          n = map(n, 0, PARAMS.midPoint, 0, 1);
          c = lerpColor(color(PARAMS.color1), color(PARAMS.color2), n);
        } else {
          n = map(n, PARAMS.midPoint, 1, 0, 1);
          c = lerpColor(color(PARAMS.color2), color(PARAMS.color3), n);
        }

        // draw bg
      } else {
        c = color(PARAMS.background);
      }
      setQuick(myImg, x, y, c);
    }
  }

  myImg.updatePixels();

  image(myImg, 0, 0, width, height);

  if (PARAMS.isAnimated) {
    loop();
    count++;
  } else {
    noLoop();
  }
}

function setQuick(img, x, y, c) {
  const i = (y * img.width + x) * 4;
  img.pixels[i + 0] = c.levels[0];
  img.pixels[i + 1] = c.levels[1];
  img.pixels[i + 2] = c.levels[2];
  img.pixels[i + 3] = c.levels[3] ? c.levels[3] : 255;
}
