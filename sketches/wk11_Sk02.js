let SONG = null;
let fft;
const freqsForEnergy = ["bass", "lowMid", "mid", "highMid", "treble"];
const points = [];

let MAX_POINTS = 0;
const MARGIN = 5;

function preload() {
  SONG = loadSound("poly-poly_change_excerpt.mp3");
}

function setup() {
  createCanvas(500, 320);
  MAX_POINTS = width / MARGIN;

  for (let i = 0; i < MAX_POINTS; i++) {
    points.push(0);
  }

  fft = new p5.FFT(0, 128);
  fft.setInput(SONG);

  /*startButton = createButton("start");
  startButton.mousePressed(start);

  stopButton = createButton("stop");
  stopButton.mousePressed(stop);*/
}

function start() {
  // SONG.loop(0, 1, 1, 0, 4);
  SONG.play(0, 1, 1, 8);
}

function stop() {
  SONG.pause();
}

function draw() {
  background(0);
  fill(255);
  noStroke();

  let spectrum = fft.analyze();

  if (frameCount === 3) {
    start();
  }

  /*noStroke();
  fill(255, 0, 255);
  for (let i = 0; i< spectrum.length; i++){
    let x = map(i, 0, spectrum.length, 0, width);
    let h = -height + map(spectrum[i], 0, 255, height, 0);
    rect(x, height, width / spectrum.length, h )
  }

  let waveform = fft.waveform();
  noFill();
  beginShape();
  stroke(20);
  for (let i = 0; i < waveform.length; i++){
    let x = map(i, 0, waveform.length, 0, width);
    let y = map( waveform[i], -1, 1, 0, height);
    vertex(x,y);
  }
  endShape(); */

  const freqs = {};

  freqs["synth"] = fft.getEnergy("bass", "lowMid") || 0;

  // freqs["mid"] = fft.getEnergy("mid") || 0

  const c1 = color("#E49BC2");
  const c2 = color("#689CC7");

  blendMode(BLEND);

  for (let i = 0; i < freqsForEnergy.length; i++) {
    const e = fft.getEnergy(freqsForEnergy[i]);
    freqs[freqsForEnergy[i]] = e;

    const c3 = lerpColor(c1, c2, i / (freqsForEnergy.length - 1));
    fill(c3);

    const size = map(e, 100, 255, 0, height);

    rect(0, height - size, width, size);
  }

  // fill( 255 )
  // const diam = map( freqs["bass"], 0, 255, 0, width/2  )
  // const y = map( freqs["lowMid"], 0, 255, height*2, height*0.25  )

  // circle( width/2, y, diam )

  /*

  points.push( freqs["synth"] );

  // noFill();
  // stroke(255);
  fill("#A5758E")
  beginShape();
  vertex( 0, height );
  for( let i = 0; i < points.length; i++ ){
    const x = i * MARGIN;
    const y = map( points[i], 0, 255, height-20, 20  )
    curveVertex( x, y )
  }
  vertex( width, height );
  endShape(CLOSE);

  if( points.length > MAX_POINTS ){
    points.shift();
  }

  // snear
  if( freqs["mid"]  > 230 ){
    push();
    fill("#689CC7")
    rect(0,0,width,height)
    pop();
  }

  */
}
