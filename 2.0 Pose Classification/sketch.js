let img;
let poseNet;
let poses = [];

function setup() {
  createCanvas(640, 360);

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
  });
  poseNet.singlePose(img);
}

function draw() {
  background(255);
  if (img) {
    image(img, 0, 0, width, height);
    if (poses.length > 0) {
      drawSkeleton();
      fill("white");
      stroke("white");
      strokeWeight(4);
      drawKeypoints();
    } else {
      fill(255);
      noStroke();
      textAlign(CENTER);
      text("calculating pose...", width / 2, height - 20);
    }
  }
}

function drawKeypoints() {
  poses.forEach(p => {
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
