// require https://cdn.jsdelivr.net/npm/tweakpane@3.0.7/dist/tweakpane.min.js
// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

// Sketch for the Pair Challenge
// Olivier building on Beatriz' sketch

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;

const params = {
  bgColor: "#000",
  size: 15,
  XAxis: 1,
  YAxis: 5,
  isStroke: true,
  density: 5,
  isConfetti: true,
  confettiAngle: 4,
};

// Tweakpane
const pane = new Tweakpane.Pane({ title: "Parameters Controller" });
pane.addInput(params, "bgColor", { view: "color" });
pane.addInput(params, "size", { step: 1, min: 5, max: 50 });
pane.addInput(params, "density", { step: 1, min: 1, max: 10 });
pane.addInput(params, "isStroke");
const f1 = pane.addFolder({ title: "Particle Spread Velocity" });
f1.addInput(params, "XAxis", { min: 0, max: 10 });
f1.addInput(params, "YAxis", { min: 0, max: 5 });
const f2 = pane.addFolder({ title: "Confetti Setting" });
f2.addInput(params, "isConfetti");
f2.addInput(params, "confettiAngle", { min: 0, max: 30 });

particles = [];

function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  rectMode(CENTER);
  ellipseMode(CENTER);
  noCursor();
  textSize(20);
}

function draw() {
  background(params.bgColor);

  if (frameCount % (11 - params.density) === 0 && !mouseIsPressed) {
    for (let i = 0; i < 2; i++) {
      let p = new Particle();
      particles.push(p);
    }
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].show();
    if (particles[i].finished()) {
      particles.splice(i, 1);
    }
  }

  if (params.isConfetti) {
    text("🎉", mouseX - 5, mouseY + 10);
  } else {
    text("🧽", mouseX - 5, mouseY + 5);
  }
}

class Particle {
  constructor() {
    this.x = mouseX;
    this.y = mouseY;
    this.vx = random(-params.XAxis, params.XAxis);
    this.vy = random(-params.YAxis, 1);
    this.alpha = 255;
    this.size = random(params.size);
    this.angle = random(-30, 30);

    this.cC = {
      r: random(255),
      g: random(255),
      b: random(255),
    };
  }

  finished() {
    return this.alpha < 0;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 5;
    this.angle += params.confettiAngle;
  }

  show() {
    push();
    if (params.isConfetti) {
      const c = color(this.cC.r, this.cC.g, this.cC.b, this.alpha);
      fill(c);
      noStroke();
      translate(this.x, this.y);
      rotate(radians(this.angle));
      rect(0, 0, 3, 10);
    } else {
      if (params.isStroke) {
        stroke(255, this.alpha);
      } else {
        noStroke();
      }
      fill(255, this.alpha);
      circle(this.x, this.y, this.size);
    }
    pop();
  }
}
