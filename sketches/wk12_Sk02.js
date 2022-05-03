// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js
// require https://cdnjs.cloudflare.com/ajax/libs/tone/13.8.6/Tone.min.js
// require https://cdn.jsdelivr.net/npm/tweakpane@3.0.7/dist/tweakpane.min.js

// https://www.youtube.com/watch?v=DBvjZwFoV2g

const FR = 60;
const pane = new Tweakpane.Pane();

const PARAMS = {
  bpm: 120,
  songIsPlaying: false,
  currentTime: 0,
  lastTime: 0,
  lastPlayTime: 0,
  beatsToShow: 6,
  beats: 4,
  beatPos: 0,
};

const synth = new Tone.Synth().toMaster();
Tone.Transport.bpm.value = PARAMS.bpm;
synth.type = "pulse";

let drawFrameCount = 0;
let isPlayingFlag = false;
let noteIndex = 0;

let t = 0;

// https://codepen.io/sjcobb/pen/BdYyXE
const stormSynth1 = [
  ["D4", "1/8"],
  ["A4", "1/8"],
  ["A4", "1/8"],
  ["E4", "1/16"],
  ["B4", "1/8"],
  ["rest", "1/16"],

  ["F4", "1/8"],
  ["C5", "1/8"],
  ["C5", "1/8"],
  ["E4", "1/16"],
  ["B4", "1/8"],
  ["rest", "1/16"],

  ["D4", "1/8"],
  ["A4", "1/8"],
  ["A4", "1/8"],
  ["E4", "1/16"],
  ["B4", "1/8"],
  ["rest", "1/16"],

  ["F4", "1/8"],
  ["C5", "1/8"],
  ["C5", "1/8"],
  ["E4", "1/16"],
  ["B4", "1/8"],
  ["rest", "1/16"],

  ["D4", "1/16"],
  ["F4", "1/16"],
  ["B4", "1/4"],

  ["D4", "1/16"],
  ["F4", "1/16"],
  ["B4", "1/4"],

  ["E5", "1/8"],
  ["F5", "1/16"],
  ["E5", "1/8"],
  ["F5", "1/16"],
  ["E5", "1/8"],
  ["C5", "1/8"],
  ["A4", "1/4"],

  ["A4", "1/8"],
  ["D4", "1/8"],
  ["F4", "1/16"],
  ["G4", "1/16"],
  ["A4", "1/4"],

  ["A4", "1/8"],
  ["D4", "1/8"],
  ["F4", "1/16"],
  ["G4", "1/16"],
  ["E4", "1/4"],

  ["D4", "1/16"],
  ["F4", "1/16"],
  ["B4", "1/4"],

  ["D4", "1/16"],
  ["F4", "1/16"],
  ["B4", "1/4"],

  ["E5", "1/8"],
  ["F5", "1/16"],
  ["E5", "1/8"],
  ["F5", "1/16"],
  ["E5", "1/8"],
  ["C5", "1/8"],
  ["A4", "1/4"],

  ["A4", "1/8"],
  ["D4", "1/8"],
  ["F4", "1/16"],
  ["G4", "1/16"],
  ["A4", "1/4"],

  ["A4", "1/8"],
  ["D4", "1/4"],
];

const melody = stormSynth1.map((n, k) => {
  // const dur = n[1] / PARAMS.beats;

  const dur = parseFloat(
    n[1]
      .replace("1/64", 1 / 64)
      .replace("1/32", 1 / 32)
      .replace("1/16", 1 / 16)
      .replace("1/8", 1 / 8)
      .replace("1/4", 1 / 4)
      .replace("1/2", 1 / 2)
  );

  const note = {
    noteName: n[0],
    time: t,
    velocity: 1,
    duration: dur * PARAMS.beats,
  };
  t += dur * PARAMS.beats;
  return note;
});

console.log(melody);

/*
const song = [
  {
    note: 208,
    duration: 1,
  },
  {
    note: "rest",
    duration: 0.5,
  },
  {
    note: 208,
    duration: 0.5,
  }
]

const melody = song.map((n, k) => {
  const note = {
    noteName: n.note,
    time: t,
    velocity: 1,
    duration: n.duration / PARAMS.beats,
  };
  t += n.duration / PARAMS.beats;
  return note;
});
*/

const playNote = () => {
  if (noteIndex < melody.length) {
    const currentNote = melody[noteIndex];

    if (PARAMS.currentTime >= currentNote.time * 1000) {
      console.log("played note", currentNote.noteName);

      if (currentNote.noteName !== "rest") {
        synth.triggerAttackRelease(currentNote.noteName, currentNote.duration);
      }
      noteIndex++;
    }
  } else {
    console.log("That's it, no more notes");
  }
};

const startSong = () => {
  t = Tone.now();

  isPlayingFlag = true;
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
    },
    [...melody]
  );

  part.start(0);
  Tone.Transport.start();
};

function setup() {
  createCanvas(610, 300);
  frameRate(FR);

  pane.addInput(PARAMS, "songIsPlaying");
  pane.addInput(PARAMS, "bpm", {
    step: 1,
    min: 60,
    max: 240,
  });
  pane.addMonitor(PARAMS, "currentTime");
  pane.addMonitor(PARAMS, "beatPos", {
    view: "graph",
    min: 0,
    max: 2,
  });
  pane.addMonitor(PARAMS, "beatPos");
  pane.addInput(PARAMS, "beatsToShow", {
    step: 1,
    min: 4,
    max: 12,
  });
}

function draw() {
  background(0);
  fill(0);
  stroke("white");
  strokeWeight(2);

  drawGraphic();

  drawTimeLine();

  if (PARAMS.songIsPlaying) {
    playNote();
    drawFrameCount++;
    getCurrentTime();
  }
  PARAMS.lastTime = millis();
}

const getCurrentTime = () => {
  PARAMS.lastPlayTime = PARAMS.lastTime;
  PARAMS.currentTime += millis() - PARAMS.lastTime;
};

const drawGraphic = () => {
  if (noteIndex > 0 && noteIndex < melody.length) {
    const currentNote = melody[noteIndex - 1];

    if (currentNote.noteName !== "rest") {
      push();
      noStroke();
      fill(255);
      textAlign(CENTER);
      textSize(32);
      text(currentNote.noteName, width / 2, 140);
      pop();
    }
  }

  // tone band
  push();
  stroke(255, 130);
  beginShape();
  vertex(141, 190);
  vertex(190, 236);
  vertex(230, 220);
  vertex(width / 2, 230);
  vertex(width - 230, 220);
  vertex(width - 190, 236);
  vertex(width - 136, 150);
  endShape();
  circle(width - 177, 122, 100);
  pop();

  // interface
  drawToneWheel(177, 122);
  drawToneWheel(width - 177, 122, true);

  circle(190, 230, 15);
  circle(width - 190, 230, 14);

  push();
  translate(240, 230);
  circle(0, 0, 26);
  circle(0, 0, 6);
  pop();

  push();
  translate(width - 240, 230);
  circle(0, 0, 26);
  line(-6, 0, 6, 0);
  pop();

  rect(width / 2 - 10, 210, 20, 20);
  line(width / 2, 220, width / 2, 230);
};

const drawToneWheel = (x, y, rotateMore = false) => {
  push();
  translate(x, y);

  rotate(
    (((PARAMS.currentTime / 1000) * PARAMS.bpm) / 100) * HALF_PI +
      (rotateMore ? PI : 0)
  );

  noFill();

  circle(0, 0, 154);
  circle(0, 0, 48);
  circle(0, 0, 30);
  circle(0, 0, 6);
  for (let l = 0; l < 3; l++) {
    line(32, 0, 64, 0);
    rotate(TWO_PI / 3);
  }

  pop();
};

let prevBeatTime = 0;
let currentBeatCount = 0;
const drawTimeLine = () => {
  const tickD = width / PARAMS.beatsToShow;

  const beatTime = (60 * 1000) / PARAMS.bpm;
  const currentTimePoint =
    PARAMS.currentTime - floor(PARAMS.currentTime / beatTime) * beatTime;
  const beatPos = map(currentTimePoint, 0, beatTime, 0, 1);
  PARAMS.beatPos = beatPos;

  const currentBeat = floor(beatPos * PARAMS.beats);

  if (currentBeat <= 0.1) {
    circle(width / 2, 180, 20);
  }

  // lines
  push();
  translate(0, 260);

  for (let i = 0; i <= PARAMS.beatsToShow; i++) {
    const x = tickD * i - beatPos * tickD;

    line(x, 0, x, 16);
  }

  push();

  const timeLineX = width / 2 - (PARAMS.currentTime / beatTime) * tickD;

  translate(timeLineX, 10);

  stroke("#D62135");

  melody.forEach((n) => {
    if (n.noteName !== "rest") {
      const x = map(n.time, 0, 2 / PARAMS.beats, 0, tickD);
      const dur = map(n.duration, 0, 2 / PARAMS.beats, 0, tickD) - 6;
      const y = 0;

      line(x, y, x + dur, y);
    }
  });

  pop();

  // main Line
  line(width / 2, -20, width / 2, 30);

  pop();
};

function mousePressed() {
  PARAMS.songIsPlaying = !PARAMS.songIsPlaying;
}
