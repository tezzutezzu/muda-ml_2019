/* 

*/

let classifier;
let firstResult;
let roundedConfidence;
let video;

function setup() {
  createCanvas(400, 40);
  video = createCapture(VIDEO);
  classifier = ml5.imageClassifier("MobileNet", video, onModelReady);
}

function onModelReady() {
  classifyVideo();
}

function draw() {
  background(255);
  if (firstResult) {
    text("I see " + firstResult, 10, 10);
    text("and I'm sure " + roundedConfidence + "% about it", 10, 25);
  }
}
// Get a prediction for the current video frame
function classifyVideo() {
  classifier.classify(onResult);
}

function onResult(error, results) {
  // Display error in the console
  if (error) {
    console.error(error);
  }
  firstResult = results[0].label;
  roundedConfidence = round(results[0].confidence * 100);
  classifyVideo();
}
