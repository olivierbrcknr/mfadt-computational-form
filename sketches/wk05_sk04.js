// require https://cdn.jsdelivr.net/npm/p5@1.4.0/lib/p5.js
// Line challenge — extension

let frequency_slider;
let frequency_slider2;
let amplitude_slider;
let speed_slider;

let startX = 50;
let startY = 250;
let endX = 450;
let endY = 50;

let pg;
let pg2;
let pg3;

let frame = 0;

const DIAMETER = 1;

const circlePositions = [];
const xShift = 1;

function setup() {
  createCanvas(500, 300);
  pg = createGraphics(width, height);
  pg2 = createGraphics(width, height);
  pg3 = createGraphics(width, height);

  createP("Frequency");
  frequency_slider = createSlider(0, 100, 10);

  createP("Frequency 2");
  frequency_slider2 = createSlider(0, 100, 10);

  createP("Amplitude");
  amplitude_slider = createSlider(0, 100, 80);

  createP("Speed");
  speed_slider = createSlider(0, 100, 30);
}

function draw() {
  background(50);
  ellipseMode(CENTER);

  const frequency = frequency_slider.value() / 100;
  const frequency2 = frequency_slider2.value() / 1000;
  const amplitude = amplitude_slider.value() / 100;
  const speed = speed_slider.value() / 100;

  noiseDetail(1, 0.5);

  fill(255);
  noStroke();

  pg.background(0);
  for (let i = 0; i < 1; i += 0.02) {
    const x = lerp(startX, endX, i);
    const y = lerp(startY, endY, i);

    const n = noise(i * frequency * 50 + frame, frameCount * frequency2);
    const offsetX = (n - 0.5) * amplitude * -100;
    const offsetY = (n - 0.5) * amplitude * -100;

    pg.push();
    // pg.colorMode(HSB, 100);
    // pg.fill( map( n, 0, 0.4, 0, 100 ), 255, 255 )

    pg.fill(255);
    pg.noStroke();
    pg.circle(x + offsetX, y + offsetY, DIAMETER);
    pg.pop();
  }

  pg2.blendMode(BLEND); // reset pg2
  pg2.background(0);
  pg2.blendMode(SCREEN); // make pg2 open to accept multiple images
  pg2.image(pg3, -1, 0, width, height); // insert saved prev image
  pg2.image(pg, 0, 0, width, height); // insert new line

  pg3.image(pg2, 0, 0, width, height); // save current image

  image(pg2, 0, 0, width, height); // draw new image

  frame += speed / 10;
}
