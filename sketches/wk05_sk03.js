// require https://cdn.jsdelivr.net/npm/p5@1.4.0/lib/p5.js
// Line challenge

let frequency_slider;
let amplitude_slider;
let speed_slider;

let startX = 50;
let startY = 250;
let endX = 450;
let endY = 50;

let frame = 0;

function setup() {
  createCanvas(500, 300);

  createP("Frequency");
  frequency_slider = createSlider(0, 100, 10);

  createP("Amplitude");
  amplitude_slider = createSlider(0, 100, 80);

  createP("Speed");
  speed_slider = createSlider(0, 100, 30);
}

function draw() {
  background(50);
  ellipseMode(CENTER);

  const frequency = frequency_slider.value() / 100;
  const amplitude = amplitude_slider.value() / 100;
  const speed = speed_slider.value() / 100;

  noiseDetail(1, 0.5);

  fill(255);
  noStroke();

  for (i = 0; i < 1; i += 0.02) {
    const x = lerp(startX, endX, i);
    const y = lerp(startY, endY, i);

    const n = noise(i * frequency * 50 + frame);

    const offsetX = (n - 0.5) * amplitude * -100;
    const offsetY = (n - 0.5) * amplitude * -100;

    ellipse(x + offsetX, y + offsetY, 10, 10);
  }
  frame += speed / 10;
}
