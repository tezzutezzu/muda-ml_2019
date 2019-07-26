

let video;
let poseNet;
let poses = [];
let printPose = true;
let running;

let bodyParts;

let canvasWitdth = 1280;
let canvasHeight = 480;
let imageWidth = 640;
let imageHeight = 480;

let monitorGraphics;
let imageCanvas;

let savedImages = [];

let m2i;
let tracker;


function setup() {
  createCanvas(canvasWitdth, canvasHeight);
  monitorGraphics = createGraphics(imageWidth, imageHeight);
  imageCanvas = createGraphics(imageWidth, imageHeight);

  tracker =  new SkeletonTracker({
    onModelLoaded: modelReady
  });

  m2i = new M2I(imageCanvas);
}

function modelReady() {
  select("#status").html("Model Loaded");
}

function draw() {
  monitorGraphics.image(video, 0, 0);

  m2i.draw(poses);

  
  drawKeypoints();
  drawSkeleton();
  image(monitorGraphics, canvasWitdth / 2, 0);
  image(imageCanvas, 0, 0);
}

function keyPressed() {
  console.log(keyCode);
  if (keyCode === 32) {
    // space
    keepImage();
  } else if (keyCode === 83) {
    // s
    saveAllImages();
  } else if (keyCode === 67) {
    // c
    m2i.clearCanvas();
  }
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
    m2i.canvas,
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
  m2i.clearCanvas();
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
