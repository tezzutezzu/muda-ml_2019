/* 
- Show ML5 site
- Show how we changed index.html
- Load the model and use a callback
- ML5 error first callbacks
- Callbacks and flags
*/

let classifier;
let img;
let classifierResults;
let imageLoaded;

function setup() {
  createCanvas(400, 400);
  classifier = ml5.imageClassifier("MobileNet", onModelReady);
}

function onModelReady() {
  img = loadImage("images/bird2.jpg", onImageReady);
}

function onImageReady() {
  imageLoaded = true;
  classifier.classify(img, onResult);
}

function draw() {
  background(255);
  if (imageLoaded === true && classifierResults) {
    image(img, 0, 0, 400, 400);
  } else {
    text("loading...", 100, 100);
  }
}

// A function to run when we get any errors and the results
function onResult(error, results) {
  // Display error in the console
  if (error) {
    console.error(error);
  }
  // The results are in an array ordered by confidence.
  console.log(results);
  classifierResults = results;
}
