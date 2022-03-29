// require https://cdn.jsdelivr.net/npm/p5@1.4.0/lib/p5.js
// require https://cdn.jsdelivr.net/npm/tweakpane@3.0.7/dist/tweakpane.min.js
// require /turtles/turtle/turtle.js
// require https://cdn.socket.io/4.4.1/socket.io.min.js

// Etch A Turtle (with blokdots)

let turtle = null;
let angleSlider = null;
let turtleImg = null;
let isMovingCheckbox = null;
let isPenDownCheckbox = null;
let imagePG = null;
let drawingPG = null;

const PARAMS = {
  value: 0,
  angle: 0,
  isMoving: false,
  isPenDown: false,
};

function preload() {
  turtleImg = loadImage("arrow.png");
}

function setup() {
  createCanvas(500, 500);
  imagePG = createGraphics(width, height);
  drawingPG = createGraphics(width, height);

  turtle = new Turtle(width / 2, height / 2, drawingPG);

  angleSlider = createSlider(0, 1023, 0, 1);
  angleSlider.position(0, height + 20);
  angleSlider.style("width", "80px");
  angleSlider.elt.addEventListener("change", () => {
    PARAMS.value = angleSlider.value();
    PARAMS.angle = getAngle(angleSlider.value());
  });

  isMovingCheckbox = document.createElement("INPUT");
  isMovingCheckbox.setAttribute("type", "checkbox");
  isMovingCheckbox.addEventListener("change", (e) => {
    PARAMS.isMoving = e.target.checked;
  });

  isPenDownCheckbox = document.createElement("INPUT");
  isPenDownCheckbox.setAttribute("type", "checkbox");
  isPenDownCheckbox.addEventListener("change", (e) => {
    PARAMS.isPenDown = e.target.checked;
  });
  document.querySelector("body").appendChild(isMovingCheckbox);
  document.querySelector("body").appendChild(isPenDownCheckbox);

  const socket = io("http://localhost:8777/blokdots");

  socket.on("connect", function () {
    console.log("Connected");
  });

  socket.on("blokdots", function (data) {
    // console.log(data);
    if (data.msg === "poti") {
      PARAMS.value = data.val;
      PARAMS.angle = getAngle(data.val);
      angleSlider.elt.value = data.val;
    }

    if (data.msg === "penDown") {
      PARAMS.isPenDown = true;
      isPenDownCheckbox.checked = true;
    }
    if (data.msg === "penUp") {
      PARAMS.isPenDown = false;
      isPenDownCheckbox.checked = false;
    }

    if (data.msg === "moveStart") {
      PARAMS.isMoving = true;
      isMovingCheckbox.checked = true;
    }
    if (data.msg === "moveEnd") {
      PARAMS.isMoving = false;
      isMovingCheckbox.checked = false;
    }
  });
}

const getAngle = (val) => {
  return (val / 1023) * 360;
};

function draw() {
  background(255);

  turtle.turnTo(PARAMS.angle);

  if (PARAMS.isMoving) {
    turtle.moveForward(1);
  }
  if (PARAMS.isPenDown) {
    turtle.penDown();
  } else {
    turtle.penUp();
  }

  // draw arrow
  imagePG.background(255);
  turtle.image(turtleImg, 8, 8, imagePG);

  push();
  image(drawingPG, 0, 0, width, height);
  blendMode(MULTIPLY);
  image(imagePG, 0, 0, width, height);
  pop();
}

// Adjusted Turtle Js

// Turtle
// Basic turtle graphics implementation:
// https://en.wikipedia.org/wiki/Turtle_graphics
// For more info on Javascript OOP:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript
//
// The turtle's coordinate system uses pixels for distance and degrees for rotations
// 0 degrees is straight right (east); positive degrees are clockwise

// Turtle constructor
// takes optional x, y starting coordinates (default is center of sketch)
function Turtle(x, y, pg) {
  // assign default values to x and y if they were not passed
  if (typeof x === "undefined") {
    x = width * 0.5;
  }
  if (typeof y === "undefined") {
    y = height * 0.5;
  }
  this.x = x;
  this.y = y;
  this.bearingRadians = 0;
  this.isPenDown = true;
  this._stateStack = [];
  this.pg = pg;
}

// moveTo instantly transports the turtle to the provided x, y location, drawing a line if pen is down
Turtle.prototype.moveTo = function (newX, newY) {
  let adjustedX = newX;
  if (adjustedX >= width) {
    adjustedX = width;
  } else if (adjustedX <= 0) {
    adjustedX = 0;
  }

  let adjustedY = newY;
  if (adjustedY >= height) {
    adjustedY = height;
  } else if (adjustedY <= 0) {
    adjustedY = 0;
  }

  if (this.isPenDown) {
    if (this.pg) {
      this.pg.line(this.x, this.y, adjustedX, adjustedY);
    } else {
      line(this.x, this.y, adjustedX, neadjustedYwY);
    }
  }

  this.x = adjustedX;
  this.y = adjustedY;
};

// moveForward moves the turtle along its current bearing, drawing a line if pen is down
Turtle.prototype.moveForward = function (distance) {
  var newX = this.x + cos(this.bearingRadians) * distance;
  var newY = this.y + sin(this.bearingRadians) * distance;
  this.moveTo(newX, newY);
};

// moveBackward moves the turtle backward from its current bearing, drawing a line if pen is down
Turtle.prototype.moveBackward = function (distance) {
  this.moveForward(-distance);
};

// turnTo changes the turtle's bearing to the provided angle in degrees
Turtle.prototype.turnTo = function (angleDegrees) {
  this.bearingRadians = radians(angleDegrees);
};

// turnRight rotates the turtle's bearing clockwise by the provided angle in degrees
Turtle.prototype.turnRight = function (amountDegrees) {
  this.bearingRadians += radians(amountDegrees);
};

// turnLeft rotates the turtle's bearing counter-clockwise by the provided angle in degrees
Turtle.prototype.turnLeft = function (amountDegrees) {
  this.bearingRadians -= radians(amountDegrees);
};

// penUp tells the turtle to move without drawing
Turtle.prototype.penUp = function () {
  this.isPenDown = false;
};

// penDown tells the turtle to draw a line when it moves
Turtle.prototype.penDown = function () {
  this.isPenDown = true;
};

// pushState records the turtle's current state (position, bearing, etc.) to a stack so that changes can be undone easily
Turtle.prototype.pushState = function () {
  this._stateStack.push({
    x: this.x,
    y: this.y,
    bearingRadians: this.bearingRadians,
    isPenDown: this.isPenDown,
  });
};

// popState restores the turtle's state to the top recorded state on the stack
Turtle.prototype.popState = function () {
  if (this._stateStack.length === 0) {
    console.error(
      "Turtle: No states left on stack. Make sure your calls to .pushState and .popState are balanced."
    );
    return;
  }
  var state = this._stateStack.pop();
  this.x = state.x;
  this.y = state.y;
  this.bearingRadians = state.bearingRadians;
  this.isPenDown = state.isPenDown;
};

// image draws and image centered on the turtle's current location and alligned with the turtle's rotation (forward = up)
Turtle.prototype.image = function (i, w, h, pg) {
  // w, h are optional parameters to this function and to p5's image
  // p5's image function will draw the image at its "normal" size if w and h are undefined

  if (pg) {
    pg.push();
    pg.translate(this.x, this.y);
    pg.rotate(this.bearingRadians + PI * 0.5);
    pg.imageMode(CENTER);
    pg.image(i, 0, 0, w, h);
    pg.pop();
  } else {
    if (this.pg) {
      this.pg.push();
      this.pg.translate(this.x, this.y);
      this.pg.rotate(this.bearingRadians + PI * 0.5);
      this.pg.imageMode(CENTER);
      this.pg.image(i, 0, 0, w, h);
      this.pg.pop();
    } else {
      push();
      translate(this.x, this.y);
      rotate(this.bearingRadians + PI * 0.5);
      imageMode(CENTER);
      image(i, 0, 0, w, h);
      pop();
    }
  }
};
