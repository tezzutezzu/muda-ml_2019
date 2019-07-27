/*
  Movements trainer
*/

const imageWidth = 200;
const imageHeight = 300;
const maxSamples = 40;

let classifier;
let ready;
let classifying = false;
let currentSamples = [];

let mainCanvas;

function setup() {
  mainCanvas = createCanvas(imageWidth, imageHeight);
  mainCanvas.id("drawingCanvas");
  mainCanvas.parent("#canvasContainer");
  startDevice();
  addButtons();
  classifier = new MovementClassifier({
    width: 640,
    height: 480,
    onLoaded: onClassifierLoaded
  });
}

function addButtons() {
  const tab1 = select("#tab1");
  const content1 = select("#content-1");

  const tab2 = select("#tab2");
  const content2 = select("#content-2");

  tab1.mousePressed(function(e) {
    content1.style("display", "block");
    content2.style("display", "none");
    tab1.addClass("active");
    tab2.removeClass("active");
  });

  tab2.mousePressed(function(e) {
    content2.style("display", "block");
    content1.style("display", "none");
    tab2.addClass("active");
    tab1.removeClass("active");
  });

  select("#class1").mousePressed(function(e) {
    const img = getImageData();
    classifier.addSample(img.imageData, "A");
    addSampleImage(img.elt, "A");
  });

  select("#class2").mousePressed(function(e) {
    const img = getImageData();
    classifier.addSample(img.imageData, "B");
    addSampleImage(img.elt, "B");
  });

  // Predict button
  buttonPredict = select("#buttonPredict");
  buttonPredict.mousePressed(updateClassifying);

  // Clear all classes button
  buttonClearAll = select("#clearAll");
  // buttonClearAll.mousePressed(clearAllLabels);
}

function onClassifierLoaded() {
  ready = true;
}

function startDevice() {
  if (window.DeviceMotionEvent == undefined) {
    alert("no sensor");
  } else {
    window.addEventListener("devicemotion", accelerometerUpdate, true);
  }
}

function accelerometerUpdate(event) {
  var aX = event.accelerationIncludingGravity.x;
  var aY = event.accelerationIncludingGravity.y;
  var aZ = event.accelerationIncludingGravity.z;
  // ix aY is negative, switch rotation
  if (aY < 0) {
    aX = -aX - 180;
  }

  if (currentSamples.length > maxSamples) {
    // remove first element
    currentSamples.shift();
  }
  currentSamples.push([aX, aY, aZ]);
}

function getImageData() {
  const scale = 0.1;
  var canvas = document.createElement("canvas");
  canvas.height = height * scale;
  canvas.width = width * scale;
  var ctx = canvas.getContext("2d");

  ctx.drawImage(mainCanvas.elt, 0, 0, width * scale, height * scale);

  var img = new Image();
  img.src = canvas.toDataURL();

  return {
    elt: img,
    imageData: ctx.getImageData(0, 0, width * scale, height * scale)
  };
}

function draw() {
  background(0);

  const interval = height / maxSamples;

  function drawSample(i, v, color) {
    fill(color);
    noStroke();
    circle(v, i * interval, 2);
  }
  currentSamples.forEach((d, i, a) => {
    const w = width / 3;
    // TODO this should be abstracted
    drawSample(i + 1, d[0] + w * 1 - w * 0.5, "red");
    drawSample(i + 1, d[1] + w * 2 - w * 0.5, "blue");
    drawSample(i + 1, d[2] + w * 3 - w * 0.5 - 30, "green");
  });
}

function addSampleImage(img, label) {
  select(`#samples${label}`).elt.appendChild(img);
}

function updateClassifying() {
  classifying = !classifying;
  buttonPredict.html(classifying ? "start predicting" : "stop predicting");
  console.log(classifier.knnClassifier.getClassifierDataset());
  const img = getImageData();
  select("#content-2").elt.appendChild(img.elt);

  classifier.classify(img.imageData, gotResults);
}

function gotResults(err, results) {
  console.log(results);
  classifier.classify(getImageData().imageData, gotResults);
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
