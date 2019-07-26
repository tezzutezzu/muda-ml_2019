/*
  Movements trainer
*/

const imageWidth = 640;
const imageHeight = 480;

let trainingSamples = [];
let currentSamples = [];
let classifier; // MovementClassifier;
let drawer; // MovementDrawer;

const maxSamples = 100;

function setup() {
  let mainCanvas = createCanvas(imageWidth, imageHeight);
  mainCanvas.id("drawingCanvas");
  mainCanvas.parent("#canvasContainer");

  createButtons();
  noStroke();
  fill(255, 0, 0);

  drawer = new MovementDrawer({
    canvas: createGraphics(imageWidth, imageHeight),
    width: 640,
    height: 480
  });

  classifier = new MovementClassifier({
    width: 640,
    height: 480
  });
}

function keyPressed() {
  reset();
  select("#status").html(`training ${key}`);
}

function keyReleased() {
  select("#status").html("");
}

function draw() {
  // draw a square on the canvas
  background(255);

  if (!classifier.loaded) {
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
      trainingSamples = [];
    }
  } else {
    const poses = classifier.poses;
    if (poses && poses.length > 0) {
      drawer.update(poses);
    }
    image(drawer.canvas, 0, 0);
    // currentSamples.push({ x: mouseX, y: mouseY });
    // drawTrail(currentSamples);
  }
}

function drawTrail(array) {}

function reset() {
  select("#status").html("");
  trainingSamples = [];
}

function addExample(label) {
  // const img = getFrameImage();
  // select(`#samples${label}`).elt.appendChild(img.elt);
}

// A util function to create UI buttons
function createButtons() {
  // Predict button
  buttonPredict = select("#buttonPredict");
  // buttonPredict.mousePressed(classify);

  // Clear all classes button
  buttonClearAll = select("#clearAll");
  // buttonClearAll.mousePressed(clearAllLabels);
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
