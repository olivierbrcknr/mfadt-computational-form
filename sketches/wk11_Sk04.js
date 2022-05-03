// require https://cdn.jsdelivr.net/npm/tweakpane@3.0.7/dist/tweakpane.min.js
// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js
// require https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/addons/p5.sound.js

const pane = new Tweakpane.Pane();

// constants
const FR = 30;
const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 300;

let mic = null;
let osc, playing;
let currentOscAmp = 0;

const audioWaves = [];
let currentAudioMax = 0;
let isWave = false;
let framesSinceLastWave = 0;
let currentMaxVol = 0;

let currentWave = [];

const PARAMS = {
  bgColor: "#000",
  lineColor: "#FF7878",
  tertiaryColor: "#FFF",
  audioThresholdMin: 0.04,
  audioThresholdMax: 0.5,
  oscThreshold: 0.6,
  speed: 3,
  amp: 1,
  freq: 500,
};

function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);

  pane.addInput(PARAMS, "bgColor", {
    view: "color",
  });
  pane.addInput(PARAMS, "lineColor", {
    view: "color",
  });
  pane.addInput(PARAMS, "tertiaryColor", {
    view: "color",
  });
  pane.addInput(PARAMS, "audioThresholdMin", {
    min: 0,
    max: 1,
  });
  pane.addInput(PARAMS, "audioThresholdMax", {
    min: 0,
    max: 1,
  });
  pane.addInput(PARAMS, "oscThreshold", {
    min: 0,
    max: 1,
  });
  pane.addInput(PARAMS, "speed", {
    min: 0,
    max: 10,
  });
  pane.addInput(PARAMS, "amp", {
    min: 0,
    max: 1,
  });
  pane.addInput(PARAMS, "freq", {
    min: 0,
    max: 500,
  });

  noFill();
  frameRate(FR);

  mic = new p5.AudioIn();
  mic.start();

  osc = new p5.Oscillator("sine");
}

function draw() {
  background(PARAMS.bgColor);
  // stroke(PARAMS.lineColor);
  const vol = mic.getLevel();

  if (vol > PARAMS.audioThresholdMin) {
    framesSinceLastWave++;
    isWave = true;
    if (vol > currentMaxVol) {
      currentMaxVol = vol;
    }
  } else if (isWave) {
    audioWaves.push({
      frame: frameCount,
      width: framesSinceLastWave,
      vol: currentMaxVol,
    });
    framesSinceLastWave = 0;
    isWave = false;
    currentMaxVol = 0;
  }

  push();

  translate(frameCount * PARAMS.speed, 0);
  fill(PARAMS.lineColor);

  let isPlaying = false;

  audioWaves.forEach((w, i) => {
    const h = map(
      w.vol,
      PARAMS.audioThresholdMin,
      PARAMS.audioThresholdMax,
      0,
      height
    );
    const x = frameCount * PARAMS.speed - w.frame * PARAMS.speed;

    rect(-1 * PARAMS.speed * w.frame, 0, w.width, h);
    if (x > width) {
      audioWaves.splice(i, 1);
    }

    if (
      !isPlaying &&
      x + w.width >= width * PARAMS.oscThreshold &&
      x <= width * PARAMS.oscThreshold
    ) {
      isPlaying = true;
      currentOscAmp = map(
        w.vol,
        PARAMS.audioThresholdMin,
        PARAMS.audioThresholdMax,
        0,
        1
      );
    }
  });

  pop();

  push();

  stroke(PARAMS.tertiaryColor);
  line(width * PARAMS.oscThreshold, 0, width * PARAMS.oscThreshold, height);

  pop();

  if (vol > currentAudioMax) {
    currentAudioMax = vol;
  }

  push();
  noStroke();
  if (vol > PARAMS.audioThresholdMin) {
    fill(PARAMS.lineColor);
  } else {
    fill(PARAMS.tertiaryColor);
  }
  rect(0, 0, 2, vol * height);
  text(nfc(vol, 2), 8, vol * height);

  push();
  fill(PARAMS.lineColor);
  rect(0, PARAMS.audioThresholdMin * height, 6, 1);
  text(nfc(PARAMS.audioThresholdMin, 2), 8, PARAMS.audioThresholdMin * height);

  rect(0, PARAMS.audioThresholdMax * height, 6, 1);
  text(nfc(PARAMS.audioThresholdMax, 2), 8, PARAMS.audioThresholdMax * height);
  pop();

  fill(PARAMS.tertiaryColor);
  rect(0, currentAudioMax * height, 6, 1);
  text(nfc(currentAudioMax, 2), 8, currentAudioMax * height);
  pop();

  if (isPlaying && !playing) {
    playOscillator();
  }

  if (!isPlaying && playing) {
    stopOscillator();
  }
}

function playOscillator() {
  const cF = map(currentOscAmp, 0, 1, 0, PARAMS.amp);

  osc.freq(PARAMS.freq);
  osc.amp(cF);

  osc.start();
  playing = true;
}

function stopOscillator() {
  // ramp amplitude to 0 over 0.5 seconds
  // osc.amp(0, 0.5);
  osc.stop();
  playing = false;
}
