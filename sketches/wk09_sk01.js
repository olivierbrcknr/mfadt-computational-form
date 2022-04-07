// require https://cdn.jsdelivr.net/npm/tweakpane@3.0.7/dist/tweakpane.min.js
// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

const EXPORT = false;
const FRAME_RATE = 20;
const DURATION = 10; // in sec

const pane = new Tweakpane.Pane();
const PARAMS = {
  frameRate: 0,
  colorDark: "#000",
  colorLight: "#FFF",
  strokeWeight: 2,
  speed: 0.5,
  skyLines: 4,
  myFrameCount: 0,
};
const buildingsRow1 = [];
const buildingsRow2 = [];
const buildingsRow3 = [];

function setup() {
  createCanvas(800, 600);

  // setup scene
  for (let i = 0; i < 30; i++) {
    // buildings.push( new Building( i, i % 3 + 1 ) );
    buildingsRow1.push(new Building(i, 1));
    buildingsRow2.push(new Building(i, 2));
    buildingsRow3.push(new Building(i, 3));
  }

  // add monitoring
  const f1 = pane.addFolder({
    title: "Monitoring",
  });
  f1.addMonitor(PARAMS, "frameRate");
  f1.addMonitor(PARAMS, "frameRate", {
    view: "graph",
    min: 0,
    max: FRAME_RATE * 1.1,
  });
  f1.addMonitor(PARAMS, "myFrameCount");
  const f2 = pane.addFolder({
    title: "Style",
  });
  f2.addInput(PARAMS, "strokeWeight", {
    min: 0,
    max: 10,
  });
  f2.addInput(PARAMS, "colorDark");
  f2.addInput(PARAMS, "colorLight");

  const f3 = pane.addFolder({
    title: "Animation",
  });
  f3.addInput(PARAMS, "speed", {
    min: 0,
    max: 5,
  });

  frameRate(FRAME_RATE);

  if (EXPORT) {
    console.log("Expected Frames", floor(DURATION * FRAME_RATE));
  }
}

function draw() {
  if (millis() > PARAMS.speed * PARAMS.myFrameCount) {
    PARAMS.myFrameCount++;
  }

  background(PARAMS.colorLight);
  strokeWeight(PARAMS.strokeWeight);

  // draw BG
  drawSky();

  const overlayColor = color(PARAMS.colorLight);
  overlayColor.setAlpha(200);
  background(overlayColor);

  // draw buildings
  for (let i = 0; i < buildingsRow1.length; i++) {
    buildingsRow1[i].draw();
  }
  for (let i = 0; i < buildingsRow2.length; i++) {
    buildingsRow2[i].draw();
  }
  for (let i = 0; i < buildingsRow3.length; i++) {
    buildingsRow3[i].draw();
  }

  // monitoring
  PARAMS.frameRate = frameRate();

  if (EXPORT) {
    console.log(frameCount);
    if (frameCount <= FRAME_RATE * DURATION) {
      saveFrame("lorn", frameCount);
    } else {
      console.log("Done 🎬");
      noLoop();
    }
  }
}

class Building {
  constructor(posX, zIndex = 1) {
    this.h = max(random(height * 0.3, height), random(height * 0.5, height));
    this.w = random(100, 200);

    this.z = zIndex;

    this.x = posX * 150 * zIndex;
    this.initialX = this.x;

    this.type = random([0, 1, 2]);
    this.angle = map(this.h, height * 0.4, height, 0.02 * PI, 0.2 * PI);
    this.centerRatio = random(0.4, 0.6);

    this.margin = random(10, 30);

    this.grain = createImage(int(this.w), int(this.h));
    this.grain.loadPixels();
    for (let y = 0; y < this.grain.height; y++) {
      for (let x = 0; x < this.grain.width; x++) {
        const r = max(random(), random());
        if (r < y / this.grain.height) {
          this.grain.set(x, y, 0);
        } else {
          this.grain.set(x, y, 255);
        }
      }
    }
    this.grain.updatePixels();
  }
  drawPattern(lineWidth) {
    push();
    translate(0, height - this.h);
    switch (this.type) {
      case 0:
        for (let l = 0; l < this.h / this.margin; l++) {
          translate(0, this.margin);
          line(0, 0, lineWidth, 0);
        }
        break;
      case 1:
        push();
        for (let w = 0; w < lineWidth / (this.margin / 2); w++) {
          translate(this.margin / 2, 0);
          line(0, 0, 0, this.h);
        }
        pop();
        for (let h = 0; h < this.h / (this.margin * 2); h++) {
          translate(0, this.margin * 2);
          line(0, 0, lineWidth, 0);
        }
        break;
      case 2:
        push();
        for (let w = 0; w < lineWidth / this.margin - 1; w++) {
          translate(this.margin, 0);
          line(0, 0, 0, this.h);
          line(4, 0, 4, this.h);
        }
        pop();
        for (let h = 0; h < this.h / this.margin; h++) {
          translate(0, this.margin);
          line(0, 0, lineWidth, 0);
        }
        break;
    }
    pop();
  }
  draw() {
    push();

    translate(this.x, 0);
    this.x -= this.z * PARAMS.speed;
    if (this.x < -2 * this.w) {
      this.x = this.initialX + width;
    }

    const leftW = this.w * this.centerRatio;
    const rightW = this.w * (1 - this.centerRatio);

    noStroke();

    // left side
    push();
    fill(PARAMS.colorDark);
    shearY(this.angle * -1);
    translate(0, tan(this.angle) * leftW * 2);
    rect(0, height - this.h, leftW, this.h);

    stroke(PARAMS.colorLight);
    this.drawPattern(leftW);
    blendMode(MULTIPLY);
    image(this.grain, 0, height - this.h, leftW, this.h, 0, 0, leftW, this.h);

    pop();

    // right side
    push();
    translate(leftW, 0);
    fill(PARAMS.colorLight);

    shearY(this.angle);
    translate(0, tan(this.angle) * leftW);
    rect(0, height - this.h, rightW, this.h);
    stroke(PARAMS.colorDark);
    this.drawPattern(rightW);
    blendMode(MULTIPLY);
    image(
      this.grain,
      0,
      height - this.h,
      rightW,
      this.h,
      leftW,
      0,
      rightW,
      this.h
    );

    pop();

    pop();
    // translate( this.w, 0 );
  }
}

const drawSky = () => {
  push();
  const margin = height * 0.1;
  const maxAmplitude = 50;

  stroke(PARAMS.colorDark);
  noFill();

  for (let l = 0; l < PARAMS.skyLines; l++) {
    beginShape();

    for (let i = 0; i <= 40; i++) {
      const tX = map(i, 0, 40, 0, width);
      const tY = l * margin;
      let n = noise(i * 2, l * 0.1);

      let double = 1;
      if (i === 0 || i === 40) {
        double = 2;
      }

      for (let d = 0; d < double; d++) {
        curveVertex(tX, n * maxAmplitude + tY);
      }
    }
    endShape();
  }
  pop();
};

const saveFrame = (name, frameNumber, extension = "png") => {
  // noLoop();
  frameNumber = floor(frameNumber);
  const paddedNumber = ("0000" + frameNumber).substr(-4, 4);
  save(name + "_" + paddedNumber + "." + extension);
  // loop();
};
