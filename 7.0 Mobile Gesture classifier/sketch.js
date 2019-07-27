/*
  Movements trainer
*/

const imageWidth = window.innerWidth;
const imageHeight = 300;
const maxSamples = 60;

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
    // classifier = new MovementClassifier({
    //   width: 640,
    //   height: 480,
    //   onLoaded: onClassifierLoaded
    // });
}

function addButtons() {
    const tab1 = select("#tab1");
    const content1 = select("#content-1");

    const tab2 = select("#tab2");
    const content2 = select("#content-2");

    tab1.mousePressed(function(e) {
        content1.style("display", "block");
        content2.style("display", "none");
        tab2.removeClass("active");
        tab1.removeClass("active");
        tab1.addClass("active");
    });

    tab2.mousePressed(function(e) {
        content2.style("display", "block");
        content1.style("display", "none");
        tab2.removeClass("active");
        tab1.removeClass("active");
        tab2.addClass("active");
    });
}

function onClassifierLoaded() {
    createButtons();
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
    console.log("ok");
}

function draw() {
    background(220);

    const xDistance = (width - 20) / maxSamples;

    function drawSample(i, y, py, color) {
        fill(color);
        noStroke();
        circle(i * xDistance, y, 10);
        if (py) {
            stroke(color);
            line(i * xDistance, y, (i - 1) * xDistance, py);
        }
    }
    currentSamples.forEach((d, i, a) => {
        drawSample(i + 1, d[0] + 20, a[i - 1], "red");
        drawSample(i + 1, d[1] + 100, a[i - 1], "blue");
        drawSample(i + 1, d[2] + 200, a[i - 1], "green");
    });
}

function addSampleImage(img, label) {
    select(`#samples${label}`).elt.appendChild(img);
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
    buttonPredict.html(classifying ? "start predicting" : "stop predicting");

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