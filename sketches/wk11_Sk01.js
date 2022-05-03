// require https://cdn.jsdelivr.net/npm/p5@1.4.0/lib/p5.js
// require https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.6.0/addons/p5.sound.js

const BUTTON_WIDTH = 80;
const BUTTON_HEIGHT = BUTTON_WIDTH;
const BEAT = 4;

const buttons = [];

let BPM = 120;

let prevBeatTime = 0;
let currentBeatCount = 0;

let slider = null;

const sounds = {};

function preload() {
  sounds.hat = loadSound("hat.wav");
  sounds.kick = loadSound("kick.wav");
  sounds.snare = loadSound("snare.wav");
  sounds.clap = loadSound("clap.wav");

  /*
  hat = loadSound("/sound/sketches/hat.wav");
  kick = loadSound("/sound/sketches/kick.wav");
  snare = loadSound("/sound/sketches/snare.wav");
  clap = loadSound("/sound/sketches/clap.wav");
  */
}
function setup() {
  createCanvas(400, 600);

  slider = createSlider(60, 220, BPM, 1);
  slider.position(20, height + 20);
  slider.style("width", "160px");
  /*slider.elt.addEventListener("change", (e) => {
    BPM = slider.value();
  });*/

  let id = 0;
  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) {
      const posX = x * BUTTON_WIDTH + (width - BUTTON_WIDTH * 4) / 2;
      const posY = y * BUTTON_WIDTH + 220;
      const isActive = id % BEAT === 0 || id % 6 === 0;
      buttons.push(new Button(id, posX, posY, isActive));
      id++;
    }
  }
}

function draw() {
  background("#555");

  BPM = slider.value();
  const millisToNextBeat = (60 / BEAT / BPM) * 1000;

  // is Beat?
  const isBeat = millis() - prevBeatTime > millisToNextBeat;
  if (isBeat) {
    prevBeatTime = millis();
    currentBeatCount++;

    if (currentBeatCount >= 16) {
      currentBeatCount = 0;
    }
  }

  // LCD SCREEN
  push();
  fill("#949B80");
  translate((width - BUTTON_WIDTH * 4) / 2, 200 - BUTTON_HEIGHT * 2);
  rect(0, 0, BUTTON_WIDTH * 4, BUTTON_HEIGHT * 2);

  fill("#303328");
  textSize(80);
  textStyle(NORMAL);
  text(BPM, 50, 140);
  textSize(16);
  textStyle(BOLD);
  text("BPM", 10, 140);

  if (currentBeatCount % BEAT === 0) {
    circle(20, 20, 20);
  }

  pop();

  buttons.forEach((b) => {
    b.draw();
  });
}

class Button {
  constructor(id, x, y, isActive) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.isActive = isActive || false;
    this.isPlaying = false;
    this.value = isActive ? 1 : 0;
  }
  draw() {
    push();
    translate(this.x, this.y);

    fill("#333");
    rect(0, 0, BUTTON_WIDTH, BUTTON_HEIGHT);

    // is active LED
    push();
    switch (this.value) {
      case 1:
        fill("#f00");
        break;
      case 2:
        fill("#0f0");
        break;
      case 3:
        fill("#00f");
        break;
      case 4:
        fill("#ff0");
        break;
      default:
        fill("#333");
        break;
    }

    circle(BUTTON_WIDTH / 2 - 10, BUTTON_HEIGHT - 10, 10);
    pop();

    // is playing LED
    if (currentBeatCount === this.id) {
      fill("white");
    } else {
      this.isPlaying = false;
    }
    circle(BUTTON_WIDTH / 2 + 10, BUTTON_HEIGHT - 10, 10);

    if (this.isActive && currentBeatCount === this.id && !this.isPlaying) {
      this.playSound();
    }
    pop();
  }
  playSound() {
    this.isPlaying = true;

    switch (this.value) {
      case 1:
        sounds.kick.play();
        break;
      case 2:
        sounds.hat.play();
        break;
      case 3:
        sounds.snare.play();
        break;
      case 4:
        sounds.clap.play();
        break;
    }
  }
  checkClick() {
    if (
      mouseX >= this.x &&
      mouseX <= this.x + BUTTON_WIDTH &&
      mouseY >= this.y &&
      mouseY <= this.y + BUTTON_HEIGHT
    ) {
      this.value++;

      if (this.value >= 5) {
        this.value = 0;
      }

      if (this.value === 0) {
        this.isActive = false;
      } else {
        this.isActive = true;
      }
    }
  }
}

function mouseClicked() {
  buttons.forEach((b) => {
    b.checkClick();
  });
}
