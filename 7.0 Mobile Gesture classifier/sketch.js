/*
  Movements trainer
*/

const imageWidth = window.innerWidth / 2;
const imageHeight = window.innerHeight;
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
        tab1.removeClass("active");
        tab2.removeClass("active");
        tab1.addClass("active");
    });

    tab2.mousePressed(function(e) {
        content2.style("display", "block");
        content1.style("display", "none");
        tab2.removeClass("active");
        tab1.removeClass("active");
        tab2.addClass("active");
    });

    select("#class1").mousePressed(function(e) {
        const img = getImageData();
        console.log(img);

        classifier.addSample(img.imageData, 1);
        addSampleImage(img.elt, 1);
    });

    select("#class2").mousePressed(function(e) {
        const img = getImageData();
        classifier.addSample(img.imageData, 2);
        addSampleImage(img.elt, 2);
    });

    // Predict button
    // buttonPredict = select("#buttonPredict");
    // buttonPredict.mousePressed(updateClassifying);

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
    background(250);

    const xDistance = (width - 20) / maxSamples;

    function drawSample(i, y, color) {
        fill(color);
        noStroke();
        circle(i * xDistance, y, 2);
    }
    currentSamples.forEach((d, i, a) => {
        // TODO this should be abstracted
        drawSample(i + 1, d[0] + 20, "red");
        drawSample(i + 1, d[1] + 30, "blue");
        drawSample(i + 1, d[2] + 50, "green");
    });
}

function addSampleImage(img, label) {
    console.log(img, label);

    select(`#samples${label}`).elt.appendChild(img);
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