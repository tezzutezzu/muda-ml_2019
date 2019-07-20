const knnClassifier = ml5.KNNClassifier();
let analyzer;
let features;
let isPredicting;
let results;

// buttons
let buttonPredict;
let buttonClearAll;

function setup() {
  createCanvas(400, 400);

  createButtons();
  updateCounts();

  navigator.mediaDevices
    .getUserMedia({
      audio: true,
      video: false
    })
    .then(startAnalyzer);
}

function draw() {
  background(0);
  if (features) {
    // drawSpectrogram();
    drawMFCCSquares();
    drawResults();
  }
}

function startAnalyzer(stream) {
  var context = new AudioContext();
  var source = context.createMediaStreamSource(stream);
  analyzer = Meyda.createMeydaAnalyzer({
    audioContext: context,
    source: source,
    // the audio features we want to extract, see here: https://meyda.js.org/audio-features
    featureExtractors: ["powerSpectrum", "mfcc"],
    callback: f => {
      features = f;
    }
  });

  analyzer.start();
}

// Add an example with a label to the classifier
function addExample(label) {
  knnClassifier.addExample(features.mfcc, label);
  updateCounts();
}

// // Predict the current frame.
function classify() {
  buttonPredict.html("stop predicting");

  // Use knnClassifier to classify which label do these features belong to
  knnClassifier.classify(features.mfcc, gotResults);
}

function stopClassify() {
  buttonPredict.html("start predicting");
}

// A util function to create UI buttons
function createButtons() {
  new StickyButton("#buttonA", "A");
  new StickyButton("#buttonB", "B");

  // Predict button
  buttonPredict = select("#buttonPredict");
  buttonPredict.mousePressed(() => {
    if (isPredicting) {
      stopClassify();
    } else {
      classify();
    }
    isPredicting = !isPredicting;
  });

  // Clear all classes button
  buttonClearAll = select("#clearAll");
  buttonClearAll.mousePressed(clearAllLabels);

  // Load saved classifier dataset
  // buttonSetData = select('#load');
  // buttonSetData.mousePressed(loadMyKNN);

  // Get classifier dataset
  // buttonGetData = select('#save');
  // buttonGetData.mousePressed(saveMyKNN);
}

// Show the results
function gotResults(err, result) {
  // Display any error
  if (err) {
    console.error(err);
  }
  results = result;
  if (isPredicting) classify();
}

// Update the example count for each label
function updateCounts() {
  const counts = knnClassifier.getCountByLabel();
  const numLabels = knnClassifier.getNumLabels();

  select("#samplesA").html(`${counts.A || 0} samples`);
  select("#samplesB").html(`${counts.B || 0} samples`);
  console.log(numLabels);

  if (numLabels > 0) {
    buttonPredict.style("visibility","visible");
    buttonClearAll.style("visibility","visible");
  } else {
    buttonPredict.style("visibility","hidden");
    buttonClearAll.style("visibility","hidden");
  }
}

// Clear the examples in one label
function clearLabel(label) {
  knnClassifier.clearLabel(label);
  updateCounts();
}

// Clear all the examples in all labels
function clearAllLabels() {
  knnClassifier.clearAllLabels();
  updateCounts();
}

// Save dataset as myKNNDataset.json
function saveMyKNN() {
  knnClassifier.save("myKNNDataset");
}

// Load dataset to the classifier
function loadMyKNN() {
  knnClassifier.load("./myKNNDataset.json", updateCounts);
}

function drawSpectrogram() {
  stroke(150);
  noFill();
  beginShape();
  features.powerSpectrum.forEach((f, i) => {
    const v = (f / 1000) * 50;
    // const a = (i/256)* PI*2;
    // const x = cos(a)*v+ width/2;
    // const y = sin(a)*v +100
    // vertex(x,y);
    vertex((width / 256) * i, 100 - v);
  });
  endShape();
}
function drawResults() {
  if (results && results.confidencesByLabel) {
    fill(255);
    console.log(results);
    const label = results.label;
    // result.label is the label that has the highest confidence
    if (label) {
      text(
        `Confident I'm hearing ${label} at ${round(
          results.confidencesByLabel[label] * 100
        )}%`,
        10,
        120
      );
    }
  }
}
function drawMFCCSquares() {
  noStroke();
  const w = width / 13;
  features.mfcc.forEach((f, i) => {
    fill(f + 40);
    rect(w * i, 0, w, w / 2);
  });
}
function StickyButton(selector, label) {
  let timer;
  let button = select(selector);

  button.mousePressed(() => {
    window.addEventListener("mouseup", onMouseup);
    timer = setInterval(() => {
      addExample(label);
    }, 500);
  });

  function onMouseup() {
    window.removeEventListener("mouseup", onMouseup);
    clearInterval(timer);
  }
}
