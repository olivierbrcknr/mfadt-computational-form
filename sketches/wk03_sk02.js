// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

let diameter = 0;
const margin = 10;

let cutCount = 0;
const speed = 0.3;
let sphere_counter = 0;
const angle = 30;
const circlePoints = 20;

const FR = 60;

const isCircle = false;
const isWeirdBlob = false;

function setup() {
  createCanvas(400, 400);

  stroke(255);
  noFill();

  frameRate(FR);

  diameter = width / 2;
  cutCount = int(diameter / margin);
  strokeWeight(0.6);
}

function draw() {
  background(0);

  // to increase
  let factor = 0;
  if (frameCount > FR * 2) {
    factor = (frameCount - FR * 2) / (FR * 5);
  }
  if (factor > 1) {
    factor = 1;
  }

  push();

  let tX = sphere_counter * speed;
  let p_now = tX / margin;
  if (tX > margin) {
    sphere_counter = 0;
  }

  translate(width / 2 - diameter / 2, height / 2);

  for (let i = 0; i < cutCount; i++) {
    let p = lerp(i / cutCount, (i + 1) / cutCount, p_now);
    let sliceCut = lerp(0, diameter, p);
    let radius = sqrt(diameter * sliceCut - pow(sliceCut, 2));

    let h = radius * 2;
    let d = radius * 2 * cos(radians(90 - angle));

    translate(margin, 0);

    if (!isCircle) {
      let n1 = noise(p, frameCount * 0.01) + 0.5;
      h *= n1;
      d *= n1;
    }

    if (isWeirdBlob) {
      beginShape();
      for (let c = 0; c <= circlePoints; c++) {
        let n2 = (noise(c * 0.5, frameCount * 0.005) - 0.5) * sin(p * PI);
        let x =
          (sin((c / circlePoints) * TWO_PI) * d) / 2 + tX + n2 * d * factor;
        let y = (cos((c / circlePoints) * TWO_PI) * h) / 2 + n2 * h * factor;
        curveVertex(x, y);
      }
      endShape(CLOSE);
    } else {
      ellipse(tX, 0, d, h);
    }
  }

  sphere_counter++;

  pop();
}
