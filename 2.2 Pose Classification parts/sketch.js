/* 
- every parts has a name
- we need dom to captture video

*/

let video;
let poseNet;
let poses = [];

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);

  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on("pose", function(results) {
    poses = results;
  });
  // Hide the video element, and just show the canvas
  video.hide();
}

function modelReady() {
  select("#status").html("Model Loaded");
}

function draw() {
  image(video, 0, 0, width, height);
  strokeWeight(2);

  // For one pose only (use a for loop for multiple poses!)
  if (poses.length > 0) {
    let pose = poses[0].pose;

    // Create a pink ellipse for the nose
    fill("red");
    let nose = pose["nose"];
    ellipse(nose.x, nose.y, 50, 50);

    //     // Create a yellow ellipse for the right eye
    //     fill(255, 215, 0);
    //     let rightEye = pose['rightEye'];
    //     ellipse(rightEye.x, rightEye.y, 20, 20);

    //     // Create a yellow ellipse for the right eye
    //     fill(255, 215, 0);
    //     let leftEye = pose['leftEye'];
    //     ellipse(leftEye.x, leftEye.y, 20, 20);
  }
}
