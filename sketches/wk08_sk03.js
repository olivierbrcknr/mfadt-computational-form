// require https://cdn.jsdelivr.net/npm/p5@1.4.0/lib/p5.js
// require /turtles/turtle/turtle.js

// extend Turtle Js to allow it to draw on a graphic
Turtle.prototype.initPG = function () {
  this.pg = createGraphics(width, height);
};
Turtle.prototype.pgMoveTo = function (newX, newY) {
  if (this.isPenDown) {
    this.pg.line(this.x, this.y, newX, newY);
  }
  this.x = newX;
  this.y = newY;
};
Turtle.prototype.pgMoveForward = function (distance) {
  var newX = this.x + cos(this.bearingRadians) * distance;
  var newY = this.y + sin(this.bearingRadians) * distance;
  this.pgMoveTo(newX, newY);
};
Turtle.prototype.pgMoveBackward = function (distance) {
  this.pgMoveForward(-distance);
};

Turtle.prototype.drawCurve = function (radius, angle, isInvert = false) {
  for (let i = 0; i < angle; i++) {
    if (isInvert) {
      this.turnLeft(1);
    } else {
      this.turnRight(1);
    }
    this.pgMoveForward(radius / 115);
  }
};

// start sketch
let t = null;

function setup() {
  createCanvas(500, 500);
  t = new Turtle(width / 2, height * 0.55);
  t.initPG();
  noLoop();
}

function draw() {
  background("#ffa500");
  // t.pg.stroke( 255 );
  t.pg.strokeWeight(2);

  // nose
  t.penDown();
  t.pgMoveForward(20);
  t.drawCurve(20, 180);
  t.drawCurve(20, 90, true);
  t.drawCurve(20, 90);

  // mouth area
  t.turnLeft(90);
  t.pgMoveForward(20);
  t.drawCurve(70, 100, true);

  // mouth
  t.pushState();
  t.turnRight(100);
  t.pgMoveForward(50);
  t.drawCurve(16, 140);
  t.drawCurve(70, 50, true);

  // teeth
  t.pushState();
  t.turnTo(-90);
  t.drawCurve(8, 180);
  t.turnTo(-80);
  t.drawCurve(8, 180);
  t.turnTo(-60);
  t.drawCurve(8, 180);
  t.turnTo(-90);
  t.drawCurve(16, 180);
  t.popState();

  // fur
  t.penUp();
  t.turnTo(90);
  t.pgMoveForward(30);
  t.pushState();
  t.penDown();
  t.pgMoveForward(30);
  t.popState();

  for (let cw = 0; cw < 5; cw++) {
    t.turnTo(0);
    t.drawCurve(100, 12, true);
    t.pushState();
    t.turnTo(90);
    t.penDown();
    t.pgMoveForward(30);
    t.popState();
  }
  t.popState();

  // whiskers?
  t.penUp();
  for (let w = 0; w < 20; w++) {
    t.drawCurve(300, 4, true);
    t.pushState();
    t.penDown();
    t.turnTo(50);
    t.drawCurve(300, 30);
    t.popState();
  }

  // head shape
  t.penDown();
  t.drawCurve(300, 90, true);
  t.pgMoveForward(20);

  // ears
  t.penUp();
  t.turnTo(0);
  t.pgMoveForward(23);
  t.drawCurve(300, 30);
  t.turnLeft(90);
  t.penDown();
  t.pgMoveForward(30);
  t.drawCurve(80, 180);
  t.drawCurve(400, 18, true);

  // eyes
  t.penUp();
  t.turnTo(180);
  t.pgMoveForward(100);
  t.turnLeft(90);
  t.pgMoveForward(30);
  t.penDown();
  t.drawCurve(40, 360, true);
  t.penUp();
  t.pgMoveForward(6);
  t.turnLeft(90);
  t.pgMoveForward(20);
  t.penDown();
  t.drawCurve(20, 360, true);
  t.penUp();
  t.turnLeft(90);
  t.pgMoveForward(13);
  t.penDown();
  t.drawCurve(6, 360, true);
  t.penUp();

  // stripes — top
  t.moveTo(width / 2, height * 0.35);
  for (let s = 0; s < 5; s++) {
    t.turnTo(-90);
    t.pgMoveForward(16);
    t.pushState();
    t.turnTo(-10);
    t.penDown();
    // t.pgMoveForward( 20 );
    t.drawCurve(s * 60 + 10, 40);
    t.popState();
  }

  // stripes — side
  t.moveTo(width / 2, height * 0.7);
  t.turnTo(0);
  t.pgMoveForward(30);
  t.penDown();
  t.drawCurve(240, 90, true);
  t.pgMoveForward(40);
  t.penUp();

  t.moveTo(width / 2 + 20, height * 0.4);

  t.pushState();
  t.turnTo(-50);
  t.pgMoveForward(100);
  t.turnRight(90);
  t.penDown();
  t.drawCurve(250, 90);
  t.popState();

  t.pushState();
  t.turnTo(-50);
  t.pgMoveForward(80);
  t.turnRight(90);
  t.penDown();
  t.drawCurve(220, 110);
  t.popState();

  t.moveTo(width / 2 + 100, height * 0.4);
  t.turnTo(90);
  t.penDown();
  t.drawCurve(100, 100);

  // draw the actual image half
  image(t.pg, 0, 0, width, height);

  // mirror image
  push();
  scale(-1, 1);
  image(t.pg, -width, 0, width, height);
  pop();
}
