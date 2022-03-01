// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js
// Instructions by Sonya Olomskaya

// INSTRUCTIONS: DIAMOND SNAKES

// 1. Have any kind of blank canvas with a drawing tool
// 2. Choose any point at the top of your canvas
// 3. Draw a zigzag line down to any point on the bottom of the canvas without lifting up your pen
// 4. From the bottom of your line, draw a zigzag line back up to the top connecting zigzag corner points to the previous line to create a pattern
// 5. Choose a new point at the top of your page
// 6. Repeat steps 2-3 (the new zigzag line cannot touch any previously drawn lines)
// 7. Continue drawing until there is no space left on the page for each new zigzag pattern to not be touching

// colors and design inspired by Peter Barnabas
// https://neobarnabas.com/Config-EU-Figma-s-Online-Design-Conference

const isDev = false;
const snakes = [];

const colors = [
  ["#F26539", "#D842F0"],
  ["#FFB800", "#F3FF6C"],
  ["#E4604A", "#6CFFDC"],
  ["#CDCDCD", "#F3FF6C"],
  ["#DB00FF", "#E4604A"],
  ["#00533F", "#FFB800"],
  ["#FFC01D", "#000000"],
  ["#6CFFDC", "#DB00FF"],
];

function setup() {
  createCanvas(600, 600);
  noLoop();
  noStroke();
  generateSetup();
}

function draw() {
  background(255);

  for (const s in snakes) {
    snakes[s].draw();
  }
}

function generateSetup() {
  const w1 = random(width * 0.2, width * 0.75);
  const h1 = random(height * 0.2, height * 0.75);
  const cols = random(colors);

  if (random([true, false])) {
    cols.reverse();
  }

  // snake 1
  snakes.push(new Snake(0, 0, w1, h1, cols));
  // snake 2
  snakes.push(new Snake(0, h1, w1, height - h1, cols));

  const h2 = random(height);
  // snake 3
  snakes.push(new Snake(w1, 0, width - w1, h2, cols));
  // snake 4
  snakes.push(new Snake(w1, h2, width - w1, height - h2, cols));
}

class Snake {
  constructor(posX, posY, w, h, c) {
    this.x = posX;
    this.y = posY;
    this.w = w;
    this.h = h;

    this.overlapFactor = random(1, 1.5);
    this.isVertical = random([true, false]);
    this.count = int(random(2, 12));

    if (this.isVertical) {
      this.elW = this.w;
      this.elH = (this.h / this.count) * this.overlapFactor;
    } else {
      this.elW = (this.w / this.count) * this.overlapFactor;
      this.elH = this.h;
    }

    /*
    this.bgColor = random(colors);
    this.color = random(colors);

    while( this.color === this.bgColor ){
      this.color = random(colors);
    }
    */
    this.bgColor = c[0];
    this.color = c[1];
  }
  draw() {
    if (isDev) {
      noFill();
      stroke(0);
    } else {
      noStroke();
      fill(this.bgColor);
    }

    rect(this.x, this.y, this.w, this.h);

    if (!isDev) {
      fill(this.color);
    }

    const yPosStart = this.y + this.elH / 2;
    const yPosEnd = this.y + this.h - this.elH / 2;

    const xPosStart = this.x + this.elW / 2;
    const xPosEnd = this.x + this.w - this.elW / 2;

    for (let i = 0; i < this.count; i++) {
      if (this.isVertical) {
        const yPos = lerp(yPosStart, yPosEnd, i / (this.count - 1));
        ellipse(this.x + this.elW / 2, yPos, this.elW, this.elH);
      } else {
        const xPos = lerp(xPosStart, xPosEnd, i / (this.count - 1));
        ellipse(xPos, this.y + this.elH / 2, this.elW, this.elH);
      }
    }
  }
}

function keyPressed() {
  if (keyCode === ENTER) {
    snakes.splice(0, snakes.length);
    generateSetup();
    redraw();
  }
}
