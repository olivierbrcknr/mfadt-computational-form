// require https://cdnjs.cloudflare.com/ajax/libs/tone/13.8.6/Tone.min.js
// require https://cdn.jsdelivr.net/npm/p5@latest/lib/p5.min.js

// Pair challenge Beatriz + Olivier

let songIsGenerated = false;
let global_SongStructure = "";
let global_SongArray = [];

const NUMBER_OF_MEASURES = 16;
const MARGIN = 40;
const SPACING = 4;
const RECT_HEIGHT = 16;
const RECT_RADIUS = 4;
let RECT_MAX_WIDTH = null; // equals 4n
const AMOUNT_OF_4N_IN_ONE_MEASURE = 3;

// First, create the synth.
// const synth = new Tone.Synth().toMaster();
const synth = new Tone.FMSynth({
  harmonicity: 5,
  modulationIndex: 3,
  detune: 0,
  oscillator: {
    type: "sine",
  },
  envelope: {
    attack: 0.1,
    decay: 0.5,
    sustain: 0.2,
    release: 1,
  },
  modulation: {
    type: "sine",
  },
  modulationEnvelope: {
    attack: 0.5,
    decay: 0,
    sustain: 1,
    release: 0.5,
  },
}).toMaster();
Tone.Transport.bpm.value = 200;
Tone.Transport.timeSignature = [6, 8];

window.onmousedown = () => {
  // Play the melody!

  const melody = generate();
  console.log(melody.length);
  play(melody);

  global_SongArray = [...melody];

  songIsGenerated = true;

  redraw();
};

// "A – B – C♯ – D – E – F♯ – G♯ – A"
const amajor = ["A3", "B3", "C#3", "D3", "E3", "F#3", "G#3", "A4", "rest"];
const minorPentantonic = ["A3", "C3", "D3", "E3", "G3"];

const cmajor = ["C3", "D3", "E3", "F3", "G3", "A3", "B3"];
const cminor = ["C3", "D3", "Eb3", "F3", "G3", "Ab3", "B3"];
const notes = amajor;

let degree = 0;

function setup() {
  createCanvas(400, 400);
  noLoop();

  RECT_MAX_WIDTH = (width - MARGIN * 2) / AMOUNT_OF_4N_IN_ONE_MEASURE;
}
function draw() {
  background(20);
  fill(255);

  if (songIsGenerated) {
    text("Structure: " + global_SongStructure, MARGIN, height - 20);

    let newPosX = 0;
    let newPosY = 0;

    for (let i = 0; i < global_SongArray.length; i++) {
      const note = global_SongArray[i];

      // text(note[0], i * 10, 40);
      // text(note[1].toNotation(), i * 10, 60);

      // const posX = MARGIN + 0;
      let recW = 10;

      switch (note[1].toNotation()) {
        case "2n":
          recW = RECT_MAX_WIDTH;
          break;
        case "2n.":
          recW = RECT_MAX_WIDTH + RECT_MAX_WIDTH / 2;
          break;
        case "4n":
          recW = RECT_MAX_WIDTH / 2;
          break;
        case "4n.":
          recW = RECT_MAX_WIDTH / 2 + RECT_MAX_WIDTH / 4;
          break;
        case "8n":
          recW = RECT_MAX_WIDTH / 4;
          break;
        case "8n.":
          recW = RECT_MAX_WIDTH / 4 + RECT_MAX_WIDTH / 8;
          break;
      }

      if (newPosX + recW > width - MARGIN * 2) {
        newPosX = 0;
        newPosY++;
      }

      recW -= SPACING;

      const posX = MARGIN + newPosX;
      const posY = MARGIN + newPosY * (RECT_HEIGHT + SPACING * 2);

      noStroke();
      // "A3", "B3", "C#3", "D3", "E3", "F#3", "G#3", "A4", "rest"
      switch (note[0]) {
        case notes[0]:
          fill("#7CDB85");
          break;
        case notes[1]:
          fill("#7E36C5");
          break;
        case notes[2]:
          fill("#B656C4");
          break;
        case notes[3]:
          fill("#DF5D8F");
          break;
        case notes[4]:
          fill("#4C56E5");
          break;
        case notes[5]:
          fill("#4A91C2");
          break;
        case notes[6]:
          fill("#21A08C");
          break;
        case notes[7]:
          fill("#E13C17");
          break;

        case "rest":
          noFill();
          stroke(255, 100);
          break;
        default:
          fill("#333");
          break;
      }

      rect(posX, posY, recW, RECT_HEIGHT, RECT_RADIUS);

      fill(255, 150);
      noStroke();
      textSize(10);
      text(note[0], posX + 3, posY + RECT_HEIGHT * 0.7);

      newPosX += recW + SPACING;
    }
  } else {
    text("click for CHAOS", 20, 20);
  }
}

function generate() {
  // choose a starting place
  degree = randomInt(0, 7);

  // generate some measures
  const a = generateMeasure();
  const b = generateMeasure();
  const c = generateMeasure();
  const d = generateMeasure();

  const ourMeasure = [
    [notes[0], Tone.Time("4n")],
    [notes[2], Tone.Time("4n")],
    [notes[4], Tone.Time("4n")],
  ];

  const measures = [a, b, c, d];

  // last note should be the tonic
  // c[c.length - 1][0] = notes[0];

  const songArray = [];

  // add our beginning
  songArray.push(ourMeasure);

  let structure = "_";

  for (let i = 0; i < NUMBER_OF_MEASURES; i++) {
    const measureNumber = Math.floor(Math.random() * 4);
    songArray.push(measures[measureNumber]);
    structure += ["a", "b", "c", "d"][measureNumber];
  }

  // add our ending
  songArray.push(ourMeasure);

  structure += "_";
  global_SongStructure = structure;
  console.log(structure);
  return [].concat(...songArray);

  // arrange the measures and return
  // return [].concat( a,b,c,a,a,d,c,a,d,a,b,a );
}

function generateMeasure() {
  const m = [];

  let timeLeft = Tone.Time("1m");

  while (timeLeft.toSeconds() > 0) {
    // choose note
    /*const change = our_sample([-1, -1, -1, 1, 1, -2, 2, 2, 2, -3]);
    degree = our_constrain(degree + change, 0, 6);
    const note = notes[degree];
    */

    let randomVal_note = Math.floor(Math.random() * notes.length + 1);
    if (randomVal_note >= notes.length) {
      randomVal_note = notes.length - 1;
    }

    const note = notes[randomVal_note];

    // choose length
    const randomVal = Math.random();

    let length = null;
    // Tone.Time( our_sample( ["2n","4n","8n"]  ));
    if (randomVal < 0.3) {
      length = Tone.Time("2n");
    } else if (randomVal < 0.6) {
      length = Tone.Time("8n");
    } else {
      length = Tone.Time("4n");
    }

    if (length.toMilliseconds() > timeLeft.toMilliseconds()) {
      length = timeLeft;
    }

    // keep track of time
    timeLeft = Tone.Time(timeLeft - length);

    // add the note to the melody
    m.push([note, length]);
  }

  return m;
}

function play(melody) {
  let t = Tone.now();
  for (const note of melody) {
    console.log(note[0], note[1].toNotation());
    if (note[0] !== "rest") {
      // synth.triggerAttackRelease(note[0], note[1]), t);
      synth.triggerAttackRelease(note[0], Tone.Time(note[1]) - 0.1, t);
    }
    t += Tone.Time(note[1]);
  }
}

console.log("click for music!");

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function our_sample(data) {
  const index = Math.floor(Math.random(data.length));
  return data[index];
}

function our_constrain(v, min, max) {
  return Math.min(max, Math.max(min, v));
}
