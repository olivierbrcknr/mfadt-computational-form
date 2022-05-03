// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js
// require https://cdnjs.cloudflare.com/ajax/libs/tone/13.8.6/Tone.min.js

let songIsPlaying = false;
let gif = null;
let frameNumber = 0;

const synth = new Tone.Synth().toMaster();
Tone.Transport.bpm.value = 200;
synth.type = "sine";

//https://create.arduino.cc/projecthub/410027/rickroll-piezo-buzzer-a1cd11?ref=part&ref_id=8233&offset=3
// {c5s, e5f, e5f, f5, a5f, f5s, f5, e5f, c5s, e5f, rest, a4f, a4f};
let a3f = 208; // 208 Hz
let b3f = 233; // 233 Hz
let b3 = 247; // 247 Hz
let c4 = 261; // 261 Hz MIDDLE C
let c4s = 277; // 277 Hz
let e4f = 311; // 311 Hz
let f4 = 349; // 349 Hz
let a4f = 415; // 415 Hz
let b4f = 466; // 466 Hz
let b4 = 493; // 493 Hz
let c5 = 523; // 523 Hz
let c5s = 554; // 554 Hz
let e5f = 622; // 622 Hz
let f5 = 698; // 698 Hz
let f5s = 740; // 740 Hz
let a5f = 831; // 831 Hz
let rest = "rest";

const song = [
  c4s,
  c4s,
  c4s,
  c4s,
  e4f,
  rest,
  c4,
  b3f,
  a3f,
  rest,
  b3f,
  b3f,
  c4,
  c4s,
  a3f,
  a4f,
  a4f,
  e4f,
  rest,
  b3f,
  b3f,
  c4,
  c4s,
  b3f,
  c4s,
  e4f,
  rest,
  c4,
  b3f,
  b3f,
  a3f,
  rest,
  b3f,
  b3f,
  c4,
  c4s,
  a3f,
  a3f,
  e4f,
  e4f,
  e4f,
  f4,
  e4f,
  c4s,
  e4f,
  f4,
  c4s,
  e4f,
  e4f,
  e4f,
  f4,
  e4f,
  a3f,
  rest,
  b3f,
  c4,
  c4s,
  a3f,
  rest,
  e4f,
  f4,
  e4f,
];

const rhythm = [
  1, 1, 1, 1, 2, 1, 1, 1, 5, 1, 1, 1, 1, 3, 1, 2, 1, 5, 1, 1, 1, 1, 1, 1, 1, 2,
  1, 1, 1, 1, 3, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 4, 5, 1, 1, 1, 1, 1, 1, 1, 2,
  2, 2, 1, 1, 1, 3, 1, 1, 1, 3,
];

let t = 0;
let melody = song.map((n, k) => {
  const note = {
    noteName: n,
    time: t,
    velocity: 1,
    duration: rhythm[k] / 4,
  };
  t += rhythm[k] / 4;
  return note;
});

const startSong = () => {
  let t = Tone.now();

  songIsPlaying = true;
  let noteCount = 0;

  var part = new Tone.Part(
    function (time, note) {
      redraw();
      if (note.noteName !== "rest") {
        synth.triggerAttackRelease(
          note.noteName,
          note.duration,
          time,
          note.velocity
        );
      }
      noteCount++;

      /*
      if( noteCount >= melody.length ){
        songIsPlaying = false;
        redraw();
        Tone.Transport.stop();
      }
      */
    },
    [...melody]
  );

  part.start(0);
  Tone.Transport.start();
};

function preload() {
  gif = loadImage("fancy.gif");
}

function setup() {
  createCanvas(220 * 2, 261 * 2);
  noLoop();
}

function draw() {
  background(random() * 255, random() * 255, random() * 255);

  if (songIsPlaying) {
    gif.pause();
    image(gif, 0, 0, width, height);

    const maxFrame = gif.numFrames() - 1;
    if (frameNumber >= maxFrame) {
      frameNumber = 0;
    }
    gif.setFrame(frameNumber);

    frameNumber++;
  } else {
    textAlign(CENTER);
    textSize(30);
    text("Click Me!", width / 2, height / 2);
  }
}

function mousePressed() {
  console.log("click");
  if (!songIsPlaying) {
    startSong();
  }
}

function touchStarted() {
  console.log("touch");
  if (!songIsPlaying) {
    startSong();
  }
}
