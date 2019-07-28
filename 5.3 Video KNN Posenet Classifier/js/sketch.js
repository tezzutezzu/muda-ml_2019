

let poseNet;
let poses = [];
let printPose = true;
let running;

let canvasWitdth;
let canvasHeight;
let imageWidth;
let imageHeight;

let monitorGraphics;
let imageCanvas;

let savedImages = [];

let motionDrawer;
let classifier;

let searchMap = {
  "crawl swimming":"crawl swimmer pool blue",
  "cycling":"bicicle cycling ",
  "running":"marthon running",
}


function setup() {

  canvasWitdth = displayWidth;
  canvasHeight = displayHeight;
  imageWidth = 640;
  imageHeight = 480;
  
  createCanvas(canvasWitdth, canvasHeight);
  monitorGraphics = createGraphics(imageWidth, imageHeight);
  imageCanvas = createGraphics(imageWidth, imageHeight);

  classifier = new MovementClassifier({
    width: imageWidth,
    height: imageHeight
  });

  motionDrawer = new MovementDrawer(imageCanvas);

  select("#keyword").changed(doSearch);
}

function draw() {
  monitorGraphics.image(classifier.video, 0, 0);

  // let imageData = motionDrawer.getImageData();
  // let img = dokument.getElementById();
  // img.src = imageData.img.src;

  
  drawKeypoints();
  drawSkeleton();
  image(monitorGraphics, 0, 0);
  image(imageCanvas, 0, imageHeight, 200, 200);
}

function doSearch(event) {
  console.log(this.value());

  let searchWord = searchMap[this.value()];
  if( searchWord === undefined) searchWord = this.value();

  let url = "https://api.qwant.com/api/search/images?count=20&t=images&safesearch=1&locale=en_US&uiv=4&imagetype=photo&q=";

  loadJSON(url + encodeURIComponent(searchWord), updateSearchImages);

  console.log(searchWord);
}

function updateSearchImages(result) {
  console.log(results);
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.25) {
        defaultDrawToMonitor(keypoint);
      }
    }
  }
}

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];
      monitorGraphics.stroke(255, 0, 0);
      monitorGraphics.line(
        partA.position.x,
        partA.position.y,
        partB.position.x,
        partB.position.y
      );
    }
  }
}

function defaultDrawToMonitor(keypoint) {
  let c = color(255, 0, 0);

  monitorGraphics.fill(c);
  monitorGraphics.noStroke();
  monitorGraphics.ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
}

function keepImage() {
  let img = createImage(imageWidth, imageHeight);

  img.copy(
    motionDrawer.canvas,
    0,
    0,
    imageWidth,
    imageHeight,
    0,
    0,
    imageWidth,
    imageHeight
  );

  savedImages.push(img);
  if (savedImages.length > 20) {
    savedImages.shift();
  }
  motionDrawer.clearCanvas();
}

function saveAllImages() {
  let cnt = 1;
  savedImages.forEach(img => {
    let keyword = $("#keyword").val();
    img.save("img_" + keyword + formatNumber(cnt++), "png");
  });
}

function formatNumber(i) {
  let num = "0000" + i;
  return num.substr(num.length - 4, 4);
}
