/**
 * MovementDrawer class
 *
 * contains all drawing function for drawing the motion point to the image
 *
 * usage:
 *
 *   imageCanvas = createGraphics(imageWidth, imageHeigt);
 *   MovementDrawer = new MovementDrawer(imageCanvas);
 *   MovementDrawer.draw(poses);
 *
 */

class MovementDrawer {
  constructor({ canvas, withSkeleton = false }) {
    this.canvas = canvas;
    this.withSkeleton = withSkeleton;
    this.currentSamples = [];


  }

  bodyParts = {
    nose: { color: color(255, 0, 0) },
    leftEye: { color: color(255, 0, 0) },
    rightEye: { color: color(255, 0, 0) },
    leftEar: { color: color(255, 0, 0) },
    rightEar: { color: color(255, 0, 0) },
    leftShoulder: { color: color(0, 0, 255) },
    rightShoulder: { color: color(240, 250, 0) },
    leftElbow: { color: color(0, 160, 255) },
    rightElbow: { color: color(250, 180, 0) },
    leftWrist: { color: color(0, 255, 255) },
    rightWrist: { color: color(255, 0, 0) },
    leftHip: { color: color(250, 180, 10) },
    rightHip: { color: color(0, 240, 100) },
    leftKnee: { color: color(240, 90, 0) },
    rightKnee: { color: color(40, 240, 0) },
    leftAnkle: { color: color(240, 0, 0) },
    rightAnkle: { color: color(180, 240, 10) }
  };

  update(poses) {
    this.defineKeypoints(poses);
    this.draw();
    // if (this.withSkeleton) this.drawSkeleton(poses);
  }

  draw() {
    // this.canvas.background(0);
    this.currentSamples.forEach(s => {
      // draw trail
      s.forEach((s, i) => {
        const color = this.bodyParts[s.part].color;
        color.setAlpha(255 * (i / 100));
        fill(color);
        circle(s.position.x, s.position.y, 5, 5);
      });
    });
  }

  // A to draw ellipses over the detected keypoints
  defineKeypoints(poses) {
    const pose = poses[0].pose;

    if (pose && pose.keypoints) {
      if (this.currentSamples.length > 100) {
        // remove first element
        this.currentSamples.shift();
      }
      this.currentSamples.push(pose.keypoints);
    }
  }

  getImageData = () => {
    const scale = 0.1;
    var canvas = document.createElement("canvas");
    canvas.height = height * scale;
    canvas.width = width * scale;
    var ctx = canvas.getContext("2d");
    console.log(this.canvas.elt)
    ctx.drawImage(this.canvas.elt, 0, 0, width * scale, height * scale);
    
    var img = new Image();
    img.src = canvas.toDataURL();

    return {
      elt: img,
      imageData: ctx.getImageData(0, 0, width * scale, height * scale)
    };
  };

  // A to draw the skeletons
  drawSkeleton(poses) {
    // Loop through all the skeletons detected
    for (let i = 0; i < poses.length; i++) {
      let skeleton = poses[i].skeleton;
      // For every skeleton, loop through all body connections
      for (let j = 0; j < skeleton.length; j++) {
        let partA = skeleton[j][0];
        let partB = skeleton[j][1];
        this.canvas.stroke(255, 0, 0);
        this.canvas.line(
          partA.position.x,
          partA.position.y,
          partB.position.x,
          partB.position.y
        );
      }
    }
  }

  clearCanvas() {
    this.canvas.background(255);
  }

  defaultDraw(keypoint) {
    let c = this.bodyParts[keypoint.part].color;

    this.canvas.fill(c);
    this.canvas.noStroke();
    this.canvas.ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
  }

  nose(keypoint) {
    defaultDraw(keypoint);
  }
  leftEye(keypoint) {
    defaultDraw(keypoint);
  }
  rightEye(keypoint) {
    defaultDraw(keypoint);
  }
  leftEar(keypoint) {
    defaultDraw(keypoint);
  }
  rightEar(keypoint) {
    defaultDraw(keypoint);
  }
  leftShoulder(keypoint) {
    defaultDraw(keypoint);
  }
  rightShoulder(keypoint) {
    defaultDraw(keypoint);
  }
  leftElbow(keypoint) {
    defaultDraw(keypoint);
  }
  rightElbow(keypoint) {
    defaultDraw(keypoint);
  }
  leftWrist(keypoint) {
    defaultDraw(keypoint);
  }
  rightWrist(keypoint) {
    defaultDraw(keypoint);
  }
  leftHip(keypoint) {
    defaultDraw(keypoint);
  }
  rightHip(keypoint) {
    defaultDraw(keypoint);
  }
  leftKnee(keypoint) {
    defaultDraw(keypoint);
  }
  rightKnee(keypoint) {
    defaultDraw(keypoint);
  }
  leftAnkle(keypoint) {
    defaultDraw(keypoint);
  }
  rightAnkle(keypoint) {
    defaultDraw(keypoint);
  }
}
