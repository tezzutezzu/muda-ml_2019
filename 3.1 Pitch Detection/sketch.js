const scale = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const minFrequency = 0;
const maxFrequency = 1500;

let loaded = false;
let midiNum = 0;
let frequency = 0;
let amplitude;
let volume = 0;


function setup() {
  createCanvas(410, 320);
  audioContext = getAudioContext();
  mic = new p5.AudioIn();
  
  // use this method to force the index of the audio source
  mic.getSources(function(deviceList) {
    mic.setSource(0);
    amplitude = new p5.Amplitude();
    amplitude.setInput(mic);
    
    mic.start(startPitch);
  });
  
}

function startPitch() {
  pitch = ml5.pitchDetection('./model/', audioContext, mic.stream, modelLoaded);
}

function modelLoaded() {
  loaded = true;
  getPitch();
}

function getPitch() {
  pitch.getPitch(function(err, f) {
   if (f) {
      frequency = f;
      midiNum = freqToMidi(frequency);
    }
    getPitch();
  })
}

function draw() {
  if (loaded) {
    background(240);
    drawCircle();
    smoothVolume()
    fill(0);
    text(round(frequency) + "Hz", 10, 20);
    text(scale[midiNum % 12], 10, 40);
  }
}

function drawCircle() {
  
  const r = volume * (width/2) + 10;
  const hue = round(map(frequency, minFrequency, maxFrequency, 0, 360));
  const saturation = round(volume * 100);
  noStroke();
  fill(`hsl(${hue},${saturation}%,50%)`);
  beginShape();
  for (i = 0; i < 360; i++) {
    const a = radians(i);
    const x = width / 2 + cos(a) * r;
    const y = height / 2 + sin(a) * r;
    vertex(x, y);
  }
  endShape();
}

// utility function to smooth the volume and clamp it to a range 
function smoothVolume() {
  volume += (amplitude.getLevel() - volume) * .5;
}