/*
  Movements trainer
*/

const imageWidth = 640;
const imageHeight = 480;

let trainingSamples = [];
let currentSamples = [];
let classifier; // MovementClassifier;
let drawer; // MovementDrawer;
let poses;
let ready;
let classifying = false;

const maxSamples = 100;
let mainCanvas;

function setup() {
  mainCanvas = createCanvas(imageWidth, imageHeight);
  mainCanvas.id("drawingCanvas");
  mainCanvas.parent("#canvasContainer");

  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  poseNet = ml5.poseNet(video, onModelReady);
  poseNet.on("pose", results => {
    poses = results;
  });

  select("#add-label-1").mousePressed(buttonAddPressed);
  select("#add-label-2").mousePressed(buttonAddPressed);
  select("#add-label-3").mousePressed(buttonAddPressed);
 

}

function onModelReady() {
  classifier = new MovementClassifier({
    width: 640,
    height: 480,
    onLoaded: onClassifierLoaded
  });
}

function onClassifierLoaded() {
  createButtons();
  noStroke();
  drawer = new MovementDrawer({
    canvas: mainCanvas,
    width: 640,
    height: 480
  });
  ready = true;
}

function keyPressed() {
  reset();
}

function keyReleased() {
}

function draw() {
  // draw a square on the canvas
  background(255);

  if (!ready) {
    text("loading", 10, 10);
    return;
  }

  if (poses && poses.length > 0) {
    drawer.update(poses);

    if (keyIsPressed && (key == 1 || key == 2 || key == 3)) {
      const img = drawer.getImageData();
      classifier.addSample(img.imageData, key);
      addSampleImage(img.elt, key);
    }
  }

  image(drawer.canvas, 0, 0);
}


function buttonAddPressed(event) {
  var labelId = this.elt.id.substr(this.elt.id.length-1, 1);
  var label = select("#label-" + labelId).value();
  console.log(label);

  const img = drawer.getImageData();
  classifier.addSample(img.imageData, label);
  addSampleImage(img.elt, labelId);
}
function drawTrail(array) {}

function reset() {
  trainingSamples = [];
}

function addSampleImage(img, label) {
  select(`#images-label-${label}`).elt.appendChild(img);
}

// A util function to create UI buttons
function createButtons() {
  // Predict button
  buttonPredict = select("#buttonPredict");
  buttonPredict.mousePressed(updateClassifying);

  select("#save").mousePressed(() => classifier.saveModel());

  // Clear all classes button
  buttonClearAll = select("#clearAll");
  // buttonClearAll.mousePressed(clearAllLabels);
}

function updateClassifying() {
  classifying = !classifying;
  buttonPredict.html(classifying ? "Start Predicting" : "Stop Predicting");

  classifier.classify(gotResults);
}

function gotResults(results) {
  classifier.classify(gotResults);
}
// Update the example count for each class
function updateCounts() {}

// // Clear the examples in one class
// function clearLabel(classLabel) {
//   knnClassifier.clearLabel(classLabel);
//   updateCounts();
// }

// // Clear all the examples in all classes
// function clearAllLabels() {
//   knnClassifier.clearAllLabels();
//   updateCounts();
// }
