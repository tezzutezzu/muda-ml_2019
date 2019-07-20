let result;

// Options for the SpeechCommands18w model, the default probabilityThreshold is 0
const options = { probabilityThreshold: 0.7 };

const classifier = ml5.soundClassifier(
  "SpeechCommands18w",
  options,
  modelReady
);

function setup() {
  createCanvas(900, 400);
}

function modelReady() {
  // segment the image given
  classifier.classify(gotResult);
}

function draw() {
  background(255);
  textSize(50);
  text("👂", 78, 50);
  text("🤖", 50, 50);
  if (result && result.confidence > 0.9) {
    text(result.label, 50, 90);
  }

  textSize(12);
  text(
    "Try saying a number from zero to nine, yes, no, left, right, up, down or stop",
    50,
    120
  );
}

function gotResult(error, results) {
  if (error) {
    console.log(error);
    return;
  }

  // sort resuts from highest to lowest
  results.sort((a, b) => b.confidence - a.confidence);

  // set result as the one with the highest confidence
  result = results[0];
}
