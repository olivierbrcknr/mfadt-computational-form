// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

// inspired by https://openprocessing.org/sketch/1233942
// CompForm Co-coding challenge #1
// Sonya and Olivier

let deck = [0, 1, 2, 3, 4, 5, 6];
let position = 0;

let colorDeck = [
  "#08F7FE",
  "#09FBD3",
  "#FE53BB",
  "#F5D300",
  "#B76CFD",
  "#011FFD",
];
let colorPosition = 0;

const squareSize = 30;
const squareRows = 20;
const squareCols = 15;

function setup() {
  createCanvas(squareSize * squareCols, squareSize * squareRows);
  noStroke();
  noLoop();
}

function draw() {
  for (let row = 0; row < squareRows; row++) {
    for (let col = 0; col < squareCols; col++) {
      push();

      translate(col * squareSize, row * squareSize);
      const pattern = getValueFromDeck();

      const color1 = getColorFromDeck();
      const color2 = getColorFromDeck();

      // our background
      fill(color1);
      rect(0, 0, squareSize, squareSize);

      fill(color2);
      switch (pattern) {
        // 2 by 2
        case 0:
          const s = squareSize / 2;
          rect(0, 0, s, s);
          rect(s, s, s, s);
          break;
        // square with dot
        case 1:
          circle(squareSize / 2, squareSize / 2, squareSize / 2);
          break;
        // triangle
        case 2:
          triangle(squareSize, 0, squareSize, squareSize, 0, squareSize);
          break;
        // dice
        case 3:
          const circleCount = 3;
          const circleBounding = squareSize / circleCount;
          const circleSize = squareSize / (circleCount * 2);

          for (let r = 0; r < circleCount; r++) {
            for (let c = 0; c < circleCount; c++) {
              circle(
                c * circleBounding + circleBounding / 2,
                r * circleBounding + circleBounding / 2,
                circleSize
              );
            }
          }
          break;
        // triangle with dots
        case 4:
          circle(squareSize * 0.3, squareSize * 0.3, squareSize / 3);
          triangle(squareSize, 0, squareSize, squareSize, 0, squareSize);
          fill(color1);
          circle(squareSize * 0.7, squareSize * 0.7, squareSize / 3);
          break;
        // square in center
        case 5:
          rect(squareSize / 4, squareSize / 4, squareSize / 2, squareSize / 2);
          break;
        // square grid
        case 6:
          const squareCount = 5;
          const squareBounding = squareSize / squareCount;
          const square = squareSize / (squareCount * 2);

          for (let r = 0; r < squareCount; r++) {
            for (let c = 0; c < squareCount; c++) {
              rect(
                c * squareBounding + squareBounding / 4,
                r * squareBounding + squareBounding / 4,
                square
              );
            }
          }
          break;
        default:
          // do nothing — should not happen
          // draws only the background square
          break;
      }

      pop();
    }
  }
}

// from compform random lecture
function getValueFromDeck() {
  let v = deck[position];
  position++;
  if (position > deck.length) {
    deck = shuffle(deck);
    v = deck[0];
    position = 1;
  }
  return v;
}

// from compform random lecture
function getColorFromDeck() {
  let v = colorDeck[colorPosition];
  colorPosition++;
  if (colorPosition > colorDeck.length) {
    colorDeck = shuffle(colorDeck);
    v = colorDeck[0];
    colorPosition = 1;
  }
  return v;
}

// redraw on "Enter"
function keyPressed() {
  if (keyCode === ENTER) {
    redraw();
  }
}
