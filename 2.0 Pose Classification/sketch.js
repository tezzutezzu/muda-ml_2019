let img;
let poseNet;
let poses = [];

function setup() {
  createCanvas(640, 360);
  fill("white");
  stroke("white");
  strokeWeight(4);

  img = loadImage("images/runner.jpg", onImageReady);
}

function onImageReady() {
  let options = {
    imageScaleFactor: 1,
    minConfidence: 0.1
  };

  poseNet = ml5.poseNet(onModelReady, options);
}

function onModelReady() {
  poseNet.on("pose", function(results) {
    poses = results;
    poseDetected();
  });
  poseNet.singlePose(img);
}

function poseDetected() {
  if (poses.length > 0) {
    image(img, 0, 0, width, height);
    drawSkeleton();
    drawKeypoints();
  }
}

// draw() will not show anything until poses are found

function draw() {}

function drawKeypoints() {
  poses.forEach(p => {
    console.log(p);

    if (p.pose.keypoints) {
      p.pose.keypoints.forEach(keypoint => {
        if (keypoint.score > 0.2) {
          circle(round(keypoint.position.x), round(keypoint.position.y), 4);
        }
      });
    }
  });
}

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  poses.forEach(p => {
    let skeleton = p.skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];
      // stroke(255);
      strokeWeight(1);
      line(
        partA.position.x,
        partA.position.y,
        partB.position.x,
        partB.position.y
      );
    }
  });
}
