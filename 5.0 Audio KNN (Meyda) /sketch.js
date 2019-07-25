/*
- KNN algorithm 
- https://en.wikipedia.org/wiki/K-nearest_neighbors_algorithm
- https://meyda.js.org/
*/
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

  // get mic input
  navigator.mediaDevices
    .getUserMedia({
      audio: true,
      video: false
    })
    .then(startAnalyzer);
}

function startAnalyzer(stream) {
  createButtons();
  updateCounts();

  var context = new AudioContext();
  var source = context.createMediaStreamSource(stream);
  analyzer = Meyda.createMeydaAnalyzer({
    audioContext: context,
    source: source,
    // the audio features we want to extract, see here: https://meyda.js.org/audio-features
    // Mel-Frequency Cepstral Coefficients
    featureExtractors: ["powerSpectrum", "mfcc"],
    callback: f => {
      features = f;
    }
  });

  analyzer.start();
}

function draw() {
  background(0);
  if (features) {
    drawMFCCSquares();
    drawResults();
  }
}

// Add an example with a label to the classifier
function addExample(label) {
  knnClassifier.addExample(features.mfcc, label);
  updateCounts();
}

function classify() {
  // Use knnClassifier to classify which label do these features belong to
  knnClassifier.classify(features.mfcc, gotResults);
}

// A util function to create UI buttons
function createButtons() {
  new StickyButton("#buttonA", "A");
  new StickyButton("#buttonB", "B");

  // Predict button
  buttonPredict = select("#buttonPredict");
  buttonPredict.mousePressed(() => {
    if (isPredicting) {
      buttonPredict.html("start predicting");
    } else {
      buttonPredict.html("stop predicting");
      classify();
    }
    isPredicting = !isPredicting;
  });

  // Clear all classes button
  buttonClearAll = select("#clearAll");
  buttonClearAll.mousePressed(clearAllLabels);
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
  console.log(counts);

  select("#samplesA").html(`${counts.A || 0} samples`);
  select("#samplesB").html(`${counts.B || 0} samples`);

  if (numLabels > 0) {
    buttonPredict.style("visibility", "visible");
    buttonClearAll.style("visibility", "visible");
  } else {
    buttonPredict.style("visibility", "hidden");
    buttonClearAll.style("visibility", "hidden");
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

function drawResults() {
  if (results && results.confidencesByLabel) {
    fill(255);
    const label = results.label;
    // result.label is the label that has the highest confidence
    if (label) {
      if (results.confidencesByLabel[label] > 0.6) {
        text(
          `Confident I'm hearing ${label} at ${round(
            results.confidencesByLabel[label] * 100
          )}%`,
          10,
          120
        );
      } else {
        text("Listening...", 10, 120);
      }
    }
  }
}

function drawMFCCSquares() {
  noStroke();
  const w = width / 13;
  features.mfcc.forEach((f, i) => {
    fill(f + 40);
    rect(w * i, 0, w, w);
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
