// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

// Kasimir Malevich, Mark Rothko, Piet Mondrian, and Anni Albers all worked with basic shapes, color, and natural media. Create a sketch that generates new works in the style of one of these artists. Pay particular attention to the subtleties and textures of your chosen artist’s work. How closely can you recreate these subtleties?

// Anni Albers

const palletes = [
  ["#BAA77D", "#7A623C", "#8E8C97", "#816D6B", "#1C1B20", "#E0DDD4"],
  ["#FFFFFF", "#747A86", "#303133", "#FDE946"],
  ["#D3BB9D", "#6C6754", "#DD4622", "#5A1A0E", "#181310"],
];
let currentPalette = [];

const COLS = 12;
const ROWS = 6;
const INNER_ROWS = 12;

let blockW = 0;
let blockH = 0;

const bristlesDiameter = 2;
const bristlesDistance = 2;

const noiseSize = 1;

function setup() {
  createCanvas(500, 700);

  // set up variables
  blockW = width / COLS;
  blockH = height / ROWS;

  noStroke();
  noLoop();
}

function draw() {
  background(255);

  currentPalette = random(palletes);

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      drawBlock(row, col);
    }
  }

  // add a little noise texture to resemble carpet better
  /*push();
  for( let row = 0; row < height; row+=noiseSize ){
    for( let col = 0; col < width; col+=noiseSize ){
      fill(0,random(0,50));
      rect(col,row,noiseSize,noiseSize);
    }
  }
  pop();*/
}

function drawBlock(r, c) {
  push();
  translate(c * blockW, r * blockH);

  let currentColor = random(currentPalette);

  // randomly select if should draw stripes
  if (random([true, false])) {
    // draw stripes
    const innerRowHeight = blockH / INNER_ROWS;

    // make sure the stripe color is a different one
    let stripeColor = random(currentPalette);
    while (stripeColor === currentColor) {
      stripeColor = random(currentPalette);
    }

    for (let i = 0; i < INNER_ROWS; i++) {
      let rectC = currentColor;
      if (i % 2 === 0) {
        rectC = stripeColor;
      }
      fill(rectC);
      // rect( 0,i*innerRowHeight, blockW, innerRowHeight );
      // drawCarpetEdge( 0,i*innerRowHeight, blockW, innerRowHeight, rectC );
      drawBristleRect(0, i * innerRowHeight, blockW, innerRowHeight, rectC);
    }
  } else {
    // draw rect
    fill(currentColor);
    // rect( 0,0, blockW, blockH );
    // drawCarpetEdge( 0,0, blockW, blockH, currentColor );
    drawBristleRect(0, 0, blockW, blockH, currentColor);
  }

  pop();
}

/*
// draw a noisy carpet edge to resemble the unevenness
// use like a rect()
function drawCarpetEdge(x,y,w,h,c) {

  push();

  // horizontal edges
  for( let col = 0; col < w; col+=bristlesDistance ){

    let pY = y + random(-0.5,0.5);
    circle( x + col, pY, bristlesDiameter);

    pY = y + random(-0.5,0.5);
    circle( x + col, pY + h, bristlesDiameter);
  }

  // vertical edges
  for( let row = 0; row < h; row+=bristlesDistance ){

    let pX = x + random(-0.5,0.5);
    circle( pX, y + row, bristlesDiameter);

    pX = x + random(-0.5,0.5);
    circle( pX + w, y + row, bristlesDiameter);
  }

  pop();

}
*/

function drawBristleRect(x, y, w, h, c) {
  push();

  // draw background to avoid flashes
  fill(c);
  rect(x, y, w, h);

  // draw bristles
  for (let col = 0; col < w; col += bristlesDistance) {
    for (let row = 0; row < h; row += bristlesDistance) {
      let newColor = null;
      // making randomly darker or lighter
      if (random([true, false])) {
        newColor = lerpColor(color(c), color(0), random(0, 0.07));
      } else {
        newColor = lerpColor(color(c), color(255), random(0, 0.07));
      }
      fill(newColor);

      let pY = y + row + random(-bristlesDistance / 4, bristlesDistance / 4);
      let pX = x + col + random(-bristlesDistance / 4, bristlesDistance / 4);
      circle(pX, pY, bristlesDiameter);
    }
  }
  pop();
}

function keyPressed() {
  if (keyCode === ENTER) {
    redraw();
  }
}
