// require https://cdn.jsdelivr.net/npm/tweakpane@3.0.7/dist/tweakpane.min.js
// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

// Personal Challenge — Ouroboros

const pane = new Tweakpane.Pane();

// parameteres
const PARAMS = {
  OuroborosLoops: 5,
  hueShift: 20,
  yShift: 10,
  xShift: 5,
};

let baseImg = null;

function preload() {
  baseImg = loadImage("/hello2.png");
}

function setup() {
  createCanvas(1920 / 4, 1432 / 4);

  pane.addInput(PARAMS, "OuroborosLoops", {
    step: 1,
    min: 1,
    max: 20,
  });
  pane.addInput(PARAMS, "hueShift", {
    min: 0,
    max: 100,
  });
  pane.addInput(PARAMS, "yShift", {
    min: -100,
    max: 100,
  });
  pane.addInput(PARAMS, "xShift", {
    min: -100,
    max: 100,
  });
  pane.on("change", () => {
    redraw();
  });

  noSmooth();
  noStroke();
  noLoop();
}

function draw() {
  background(0);

  // dummy image to load and rewrite over and over and over and ...
  const pg = createGraphics(width, height);
  pg.image(baseImg, 0, 0, width, height);

  // loop = ouroboros
  for (let i = 0; i < PARAMS.OuroborosLoops; i++) {
    // load current pixels / update new pixels
    pg.loadPixels();

    for (let y = 0; y < pg.height; y++) {
      for (let x = 0; x < pg.width; x++) {
        colorMode(RGB);
        const pxColor = pg.get(x, y);

        // do nothing for white pixels
        if (!pxColor.every((v) => v === 255)) {
          let hueVal = hue(pxColor) + PARAMS.hueShift;
          if (hueVal > 100) {
            hueVal = hueVal - 100;
          }

          colorMode(HSB);
          const c2 = color(hueVal, 255, 255);

          pg.set(x + PARAMS.xShift, y + PARAMS.yShift, c2);
        }
      }
    }

    // update pixels
    pg.updatePixels();
    // store image in itself again
    pg.image(pg, 0, 0, width, height);
  }

  // draw final result
  image(pg, 0, 0, width, height);
}

// these two did not seem to work this time
/*
function getQuick(img, x, y) {
  const i = (y * img.width + x) * 4;
  return {
    r: img.pixels[i],
    g: img.pixels[i + 1],
    b: img.pixels[i + 2],
    a: img.pixels[i + 3],
  };
}

function setQuick(img, x, y, c) {
  const i = (y * img.width + x) * 4;
  img.pixels[i + 0] = c.levels[0]
  img.pixels[i + 1] = c.levels[1]
  img.pixels[i + 2] = c.levels[2]
  img.pixels[i + 3] = c.levels[3]
}
*/
