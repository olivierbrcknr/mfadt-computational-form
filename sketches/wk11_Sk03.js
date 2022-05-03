// require https://cdn.jsdelivr.net/npm/tweakpane@3.0.7/dist/tweakpane.min.js
// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js
// require https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.18.0/matter.min.js

// Matter JS p5 classes taken from Benedikt Gross
// https://github.com/b-g/p5-matter-examples

let t1 = 0.1; // attack time in seconds
let l1 = 0.7; // attack level 0.0 to 1.0
let t2 = 0.3; // decay time in seconds
let l2 = 0.1; // decay level  0.0 to 1.0

let env;
let triOsc;

let blockA;
let blockB;
let ground;
let sphere;

function setup() {
  createCanvas(800, 600);

  env = new p5.Envelope(t1, l1, t2, l2);
  triOsc = new p5.Oscillator("triangle");

  // create an engine
  const engine = Matter.Engine.create();
  const world = engine.world;

  // create two boxes and a ground
  ground = new Block(
    world,
    { x: 400, y: height, w: 810, h: 15, color: "grey" },
    { label: "ground", isStatic: true }
  );

  sphere = new Ball(
    world,
    { x: 300, y: 300, r: 30, color: "magenta" },
    { density: 0.0001, label: "ball" }
  );

  // setup hit sound
  Matter.Events.on(engine, "collisionStart", function (event) {
    const pairs = event.pairs[0];
    const bodyA = pairs.bodyA;
    const bodyB = pairs.bodyB;
    if (bodyA.label === "ground" || bodyB.label === "ball") {
      console.log("hit");
    }
  });

  // run the engine
  Matter.Runner.run(engine);
}

function playSound() {
  // starting the oscillator ensures that audio is enabled.
  triOsc.start();
  env.play(triOsc);
}

function draw() {
  background("black");
  sphere.draw();
  ground.draw();
}
