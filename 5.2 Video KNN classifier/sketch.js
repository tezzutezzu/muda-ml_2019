let video;
let posX;
let posY;
const knnClassifier = ml5.KNNClassifier();
let featureExtractor;
let currentSamples = [];
const maxSamples = 100;

function setup() {
  const canvas = createCanvas(640, 480);
  canvas.id("drawingCanvas");

  posX = width / 2;
  posY = height / 2;
  canvas.parent("#canvasContainer");
  createButtons();
  noStroke();
  fill(255, 0, 0);
}

function keyPressed() {
  reset();
  select("#status").html(`training ${key}`);
}

function keyReleased() {
  console.log(key);

  select("#status").html("");
  const img = getFrameImage();
  select(`#samples${key}`).elt.appendChild(img);
}

function draw() {
  // draw a square on the canvas
  background(255);
  if (keyIsPressed) {
    if (currentSamples.length < 100) {
      currentSamples.push({ x: mouseX, y: mouseY });
      currentSamples.forEach((s, i) => {
        fill(color(100, 0, 0, 255 * (i / 100)));
        rect(s.x, s.y, 10, 10);
      });
    }
  }
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
  return img;
}

function reset() {
  console.log("resetting");
  select("#status").html("");
  currentSamples = [];
}

function addExample(label) {
  console.log(features);

  // Add an example with a label to the classifier
  knnClassifier.addExample(features, label);
  updateCounts();
}

// Predict the current frame.
function classify() {
  // Get the total number of labels from knnClassifier
  const numLabels = knnClassifier.getNumLabels();
  if (numLabels <= 0) {
    console.error("There is no examples in any label");
    return;
  }

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

  if (result.confidencesByLabel) {
    const confidences = result.confidencesByLabel;
    // result.label is the label that has the highest confidence
    if (result.label) {
    }
  }

  classify();
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
