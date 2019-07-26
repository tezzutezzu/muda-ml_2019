let classifier;
let modelLoaded = false;
let featureExtractor;
const knnClassifier = ml5.KNNClassifier();

let trainingSamples = [];
let currentSamples = [];

const maxSamples = 100;

function setup() {
  const canvas = createCanvas(640, 480);
  canvas.id("drawingCanvas");
  featureExtractor = ml5.featureExtractor("MobileNet", onFeaturesReady);
  canvas.parent("#canvasContainer");
  createButtons();
  noStroke();
  fill(255, 0, 0);
}

function onFeaturesReady() {
  classifier = ml5.imageClassifier("MobileNet", onModelReady);
}

function onModelReady() {
  modelLoaded = true;
}

function keyPressed() {
  reset();
  select("#status").html(`training ${key}`);
}

function keyReleased() {
  console.log(key);

  select("#status").html("");
}

function draw() {
  // draw a square on the canvas
  background(255);

  if (!modelLoaded) {
    text("loading", 10, 10);
    return;
  }

  if (keyIsPressed) {
    //training
    if (trainingSamples.length < 100) {
      trainingSamples.push({ x: mouseX, y: mouseY });
      drawTrail(trainingSamples);
    } else {
      drawTrail(trainingSamples);
      addExample(key);
      trainingSamples = [];
    }
  } else {
    // predicting
    if (currentSamples.length > 100) {
      // remove first element
      currentSamples.shift();
    }
    currentSamples.push({ x: mouseX, y: mouseY });
    drawTrail(currentSamples);
  }
}

function drawTrail(array) {
  array.forEach((s, i) => {
    fill(color(100, 0, 0, 255 * (i / 100)));
    circle(s.x, s.y, 5, 5);
  });
}
function getFrameImage() {
  const scale = 0.1;
  var canvas = document.createElement("canvas");
  canvas.height = height * scale;
  canvas.width = width * scale;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(
    select("#drawingCanvas").elt,
    0,
    0,
    width * scale,
    height * scale
  );

  var img = new Image();
  img.src = canvas.toDataURL();

  return {
    elt: img,
    imageData: ctx.getImageData(0, 0, width * scale, height * scale)
  };
}

function reset() {
  select("#status").html("");
  trainingSamples = [];
}

function addExample(label) {
  const img = getFrameImage();

  select(`#samples${label}`).elt.appendChild(img.elt);
  console.log(img);

  const features = featureExtractor.infer(img.imageData);

  // Add an example with a label to the classifier
  knnClassifier.addExample(features, label);
  // updateCounts();
}

// Predict the current frame.
function classify() {
  // Get the total number of labels from knnClassifier
  const numLabels = knnClassifier.getNumLabels();
  if (numLabels <= 0) {
    console.error("There is no examples in any label");
    return;
  }
  const features = featureExtractor.infer(getFrameImage().imageData);
  // Use knnClassifier to classify which label do these features belong to
  knnClassifier.classify(features, gotResults);
}

// A util function to create UI buttons
function createButtons() {
  // Predict button
  buttonPredict = select("#buttonPredict");
  buttonPredict.mousePressed(classify);

  // Clear all classes button
  buttonClearAll = select("#clearAll");
  buttonClearAll.mousePressed(clearAllLabels);
}

function gotResults(err, result) {
  if (err) {
    console.error(err);
  }
  console.log(result);

  if (result.confidencesByLabel) {
    const confidences = result.confidencesByLabel;
    // result.label is the label that has the highest confidence
    if (result.label) {
    }
  }
  setTimeout(d => classify(), 1000);
}

// Update the example count for each class
function updateCounts() {}

// Clear the examples in one class
function clearLabel(classLabel) {
  knnClassifier.clearLabel(classLabel);
  updateCounts();
}

// Clear all the examples in all classes
function clearAllLabels() {
  knnClassifier.clearAllLabels();
  updateCounts();
}
