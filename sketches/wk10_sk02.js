// require https://cdn.jsdelivr.net/npm/tweakpane@3.0.7/dist/tweakpane.min.js
// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

const pane = new Tweakpane.Pane();

const PARAMS = {
  frequency: 0.1,
  move: true,
  moveSpeed: 0.01,
};

let inp = null;

// shades picked from here
// http://mewbies.com/geek_fun_files/ascii/ascii_art_light_scale_and_gray_scale_chart.htm

const shades = [
  ".'`,^:;~'".split(""),
  "-_+<>i!lI?".split(""),
  "/|()1{}[]".split(""),
  "rcvunxzjft".split(""),
  "0LCJUYXZOQ".split(""),
  "oahkbdpqwm".split(""),
  "*WMB8&%$#@".split(""),
];

function setup() {
  createCanvas(600, 500);

  let startVal = "";

  shades.forEach((s) => {
    startVal += random(s);
  });

  inp = createInput(startVal);
  inp.position(10, height + 10);
  inp.size(100);
  inp.input(redraw);
  frameRate(30);

  pane.addInput(PARAMS, "frequency", {
    min: 0.05,
    max: 0.5,
  });
  pane.addInput(PARAMS, "move");
  pane.addInput(PARAMS, "moveSpeed", {
    min: 0.005,
    max: 0.2,
  });
  pane.on("change", redraw);
}

const CHAR_WIDTH = 10;
const CHAR_HEIGHT = 10;

function draw() {
  background("black");

  const COLS = width / CHAR_WIDTH;
  const ROWS = height / CHAR_HEIGHT;

  for (let x = 0; x < COLS; x++) {
    for (let y = 0; y < ROWS; y++) {
      let n = 0;

      if (PARAMS.move) {
        n = noise(
          x * PARAMS.frequency + frameCount * PARAMS.moveSpeed,
          y * PARAMS.frequency + frameCount * PARAMS.moveSpeed
        );
      } else {
        n = noise(x * PARAMS.frequency, y * PARAMS.frequency);
      }

      const c = floor(map(n, 0, 1, 0, shades.length - 1));

      // only select the chars that fit in the name
      let possibleChars = shades[c].filter((ch) => inp.value().includes(ch));

      if (possibleChars.length) {
        // char = random(possibleChars);
        fill("white");
      } else {
        possibleChars = shades[c];
        fill("#666");
      }
      // char = random(possibleChars);
      const char = possibleChars[0];
      text(
        char,
        CHAR_WIDTH * 0.15 + x * CHAR_WIDTH,
        CHAR_HEIGHT * 0.8 + y * CHAR_HEIGHT
      );
    }
  }
  if (PARAMS.move) {
    if (isLooping() === false) {
      loop();
    }
  } else {
    noLoop();
  }
}
