// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
PoseNet example using p5.js
=== */

let video;
let poseNet;
let poses = [];
let printPose = true;
let running;

let bodyParts;

let canvasWitdth = 1280;
let canvasHeight = 480;
let imageWidth = 640;
let imageHeigt = 480;

let monitorGraphics;
let masterGraphics;

let savedImages = [];

function setup() {
  
  bodyParts = {

    nose: { color: color(230,230,230), func: nose},
    leftEye: { color: color(230,230,230), func: leftEye},
    rightEye: { color: color(230,230,230), func: rightEye},
    leftEar: { color: color(230,230,230), func: leftEar},
    rightEar: { color: color(230,230,230), func: rightEar},
    leftShoulder: { color: color(0,0,255), func: leftShoulder},
    rightShoulder: { color: color(240,250,0), func: rightShoulder},
    leftElbow: { color: color(0,160,255), func: leftElbow},
    rightElbow: { color: color(250,180,0), func: rightElbow},
    leftWrist: { color: color(0,255,255), func: leftWrist},
    rightWrist: { color: color(255,0,0), func: rightWrist},
    leftHip: { color: color(250,180,10), func: leftHip},
    rightHip: { color: color(0,240,100), func: rightHip},
    leftKnee: { color: color(240,90,0), func: leftKnee},
    rightKnee: { color: color(40,240,0), func: rightKnee},
    leftAnkle: { color: color(240,0,0), func: leftAnkle},
    rightAnkle: { color: color(180,240,10), func: rightAnkle},
  }
  
  createCanvas(canvasWitdth, canvasHeight);
  monitorGraphics = createGraphics(imageWidth, imageHeigt);
  masterGraphics = createGraphics(imageWidth, imageHeigt);
  clearMasterGraphics();

  video = createCapture(VIDEO);
  video.size(monitorGraphics.width, monitorGraphics.height);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function(results) {
    if( printPose ) {
      console.log(results, bodyParts);
      printPose = false;
    }
    poses = results;
  });
  // Hide the video element, and just show the canvas
  video.hide();
}

function modelReady() {
  select('#status').html('Model Loaded');
}

function draw() {

  running = $("#running").is(":checked");

  // We can call both functions to draw all keypoints and the skeletons
  if( frameCount % 240 === 0) {
    //keepImage();
  }

  monitorGraphics.image(video,0,0);

  drawKeypoints();
  drawSkeleton();
  image(monitorGraphics, canvasWitdth/2, 0);
  image(masterGraphics, 0, 0);
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
  clearMasterGraphics();
}
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints()  {
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
        if( running) {
          bodyParts[keypoint.part].func(keypoint);
        }
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
      monitorGraphics.line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}

function defaultDrawToMonitor(keypoint) {
  let c = color(255,0,0);

  monitorGraphics.fill(c);
  monitorGraphics.noStroke();
  monitorGraphics.ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
}


function defaultDraw(keypoint) {
  let c = bodyParts[keypoint.part].color;

  masterGraphics.fill(c);
  masterGraphics.noStroke();
  masterGraphics.ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
}

function nose(keypoint){
  defaultDraw(keypoint);
}
function leftEye(keypoint){
  defaultDraw(keypoint);
}
function rightEye(keypoint){
  defaultDraw(keypoint);
}
function leftEar(keypoint){
  defaultDraw(keypoint);
}
function rightEar(keypoint){
  defaultDraw(keypoint);
}
function leftShoulder(keypoint){
  defaultDraw(keypoint);
}
function rightShoulder(keypoint){
  defaultDraw(keypoint);
}
function leftElbow(keypoint){
  defaultDraw(keypoint);
}
function rightElbow(keypoint){
  defaultDraw(keypoint);
}
function leftWrist(keypoint){
  defaultDraw(keypoint);
}
function rightWrist(keypoint){
  defaultDraw(keypoint);
}
function leftHip(keypoint){
  defaultDraw(keypoint);
}
function rightHip(keypoint){
  defaultDraw(keypoint);
}
function leftKnee(keypoint){
  defaultDraw(keypoint);
}
function rightKnee(keypoint){
  defaultDraw(keypoint);
}
function leftAnkle(keypoint){
  defaultDraw(keypoint);
}
function rightAnkle(keypoint){
  defaultDraw(keypoint);
}


function keepImage() {
  let img = createImage(imageWidth, imageHeigt);

  img.copy(masterGraphics, 0, 0, imageWidth, imageHeigt, 0, 0, imageWidth, imageHeigt);

  savedImages.push(img);
  if(savedImages.length > 20) {
    savedImages.shift();
  }
  clearMasterGraphics();
}

function clearMasterGraphics() {
  masterGraphics.background(255);

}

function saveAllImages() {

  let cnt = 1;
  savedImages.forEach( img => {
    let keyword = $("#keyword").val();
    img.save('img_' + keyword + formatNumber(cnt++  ), 'png');
  })

}

function formatNumber(i) {
  let num = ("0000" + i);
  return num.substr(num.length-4, 4);
}