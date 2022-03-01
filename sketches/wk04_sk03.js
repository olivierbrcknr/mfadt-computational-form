// require https://cdn.jsdelivr.net/npm/tweakpane@3.0.7/dist/tweakpane.min.js
// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

// inspiration "Who Are I" by Maximilian Klein
// https://parsons.edu/dt-2020/whoarei/

// images from https://github.com/ozgrozer/100k-faces

const pane = new Tweakpane.Pane();

// constants
const FR = 30;
const CANVAS_SIZE = 800;
const MAX_FACES = 6;
const ORIGINAL_IMAGE_SIZE = 1024;

// positions are in percent
const FEATURES = [
  {
    name: "left face half",
    position: {
      x: 5,
      y: 5,
      w: 50,
      h: 85,
    },
  },
  {
    name: "right upper face half",
    position: {
      x: 40,
      y: 50,
      w: 45,
      h: 45,
    },
  },
  {
    name: "right lower face half",
    position: {
      x: 50,
      y: 10,
      w: 40,
      h: 40,
    },
  },
  {
    name: "eyes",
    position: {
      x: 25,
      y: 35,
      w: 50,
      h: 25,
    },
  },
  {
    name: "mouth",
    position: {
      x: 35,
      y: 55,
      w: 40,
      h: 30,
    },
  },
  {
    name: "nose",
    position: {
      x: 40,
      y: 48,
      w: 20,
      h: 20,
    },
  },
];

// parameteres
const PARAMS = {
  isDev: false,
  faceElements: {
    // add via script
  },
};

const setupFeatures = () => {
  FEATURES.forEach((f) => {
    PARAMS.faceElements[f.name] = {
      ...f.position,
      shiftX: 0,
      shiftY: 0,
    };
  });
};

// https://glitch.com/edit/#!/100k-faces?path=server.js%3A11%3A0
const strPad = (str) => {
  return "000".slice(str.toString().length) + str;
};
const randomImageUrl = () => {
  const baseUrl = "https://ozgrozer.github.io/100k-faces/";
  const firstFolder = "0";
  const secondFolder = int(random(0, 9));
  const randomFile = strPad(int(random(0, 999)));
  const filename = `00${secondFolder}${randomFile}`;
  const fullUrl = `${baseUrl}${firstFolder}/${secondFolder}/${filename}.jpg`;
  const result = {
    url: fullUrl,
  };
  return result;
};
// end copy ———————————

const FACES = [];
let IMAGE_ORDER = [];
let currentIndex = 0;

// https://github.com/ozgrozer/100k-faces
function preload() {
  for (let i = 0; i < MAX_FACES; i++) {
    FACES[i] = loadImage(randomImageUrl().url);
  }
}

function setup() {
  createCanvas(CANVAS_SIZE, CANVAS_SIZE);
  noLoop();

  setupFeatures();

  for (let i = 0; i < MAX_FACES; i++) {
    IMAGE_ORDER.push(i);
  }

  pane.addInput(PARAMS, "isDev");

  for (const feature in PARAMS.faceElements) {
    console.log(`${feature}: ${PARAMS.faceElements[feature]}`);
    const f1 = pane.addFolder({
      title: feature,
      expanded: false,
    });
    f1.addInput(PARAMS.faceElements[feature], "shiftX", {
      min: -50,
      max: 50,
    });
    f1.addInput(PARAMS.faceElements[feature], "shiftY", {
      min: -50,
      max: 50,
    });
    f1.addInput(PARAMS.faceElements[feature], "x", {
      min: 0,
      max: 100,
    });
    f1.addInput(PARAMS.faceElements[feature], "y", {
      min: 0,
      max: 100,
    });
    f1.addInput(PARAMS.faceElements[feature], "w", {
      min: 0,
      max: 100,
    });
    f1.addInput(PARAMS.faceElements[feature], "h", {
      min: 0,
      max: 100,
    });
  }

  pane.on("change", () => {
    redraw();
  });

  const btn = pane.addButton({
    title: "Shuffle Images",
  });
  btn.on("click", () => {
    IMAGE_ORDER = shuffle(IMAGE_ORDER);
    redraw();
  });
}

function draw() {
  background(0);
  currentIndex = 0;

  for (const feature in PARAMS.faceElements) {
    const f = PARAMS.faceElements[feature];
    push();
    const shiftX = map(f.shiftX, 0, 100, 0, width);
    const shiftY = map(f.shiftY, 0, 100, 0, height);
    translate(shiftX, shiftY);
    drawFaceSection(f.x, f.y, f.w, f.h);
    pop();
  }
}

const drawFaceSection = (x, y, w, h) => {
  const i = IMAGE_ORDER[currentIndex]; // int( random(MAX_FACES) )

  const dx = map(x, 0, 100, 0, width);
  const dy = map(y, 0, 100, 0, height);
  const dw = map(w, 0, 100, 0, width);
  const dh = map(h, 0, 100, 0, height);

  const sx = map(x, 0, 100, 0, ORIGINAL_IMAGE_SIZE);
  const sy = map(y, 0, 100, 0, ORIGINAL_IMAGE_SIZE);
  const sw = map(w, 0, 100, 0, ORIGINAL_IMAGE_SIZE);
  const sh = map(h, 0, 100, 0, ORIGINAL_IMAGE_SIZE);

  image(FACES[i], dx, dy, dw, dh, sx, sy, sw, sh);

  currentIndex++;

  if (PARAMS.isDev) {
    push();
    noFill();
    stroke("red");
    rect(dx, dy, dw, dh);
    pop();
  }
};
