/**
 * Motion to Image (M2I) class 
 * 
 * contains all drawing function for drawing the motion point to the image
 * 
 * usage:
 * 
 *   imageCanvas = createGraphics(imageWidth, imageHeigt);
 *   m2i = new M2I(imageCanvas);
 *   m2i.draw(poses);
 * 
 */

class M2I {
    constructor(canvas, withSkeleton=false) {
        this.canvas = canvas;
        this.withSkeleton = withSkeleton;
    }

    running = true;

    bodyParts = {

        nose: { color: color(230,230,230)},
        leftEye: { color: color(230,230,230)},
        rightEye: { color: color(230,230,230)},
        leftEar: { color: color(230,230,230)},
        rightEar: { color: color(230,230,230)},
        leftShoulder: { color: color(0,0,255)},
        rightShoulder: { color: color(240,250,0)},
        leftElbow: { color: color(0,160,255)},
        rightElbow: { color: color(250,180,0)},
        leftWrist: { color: color(0,255,255)},
        rightWrist: { color: color(255,0,0)},
        leftHip: { color: color(250,180,10)},
        rightHip: { color: color(0,240,100)},
        leftKnee: { color: color(240,90,0)},
        rightKnee: { color: color(40,240,0)},
        leftAnkle: { color: color(240,0,0)},
        rightAnkle: { color: color(180,240,10)},
      }
    

    // Adding a method to the constructor
    draw(poses) {
        //console.log(poses);
        this.drawKeypoints(poses);
        //this.drawSkeleton(poses);
    }


    // A to draw ellipses over the detected keypoints
    drawKeypoints(poses)  {
        // Loop through all the poses detected
        for (let i = 0; i < poses.length; i++) {
        // For each pose detected, loop through all the keypoints
        let pose = poses[i].pose;
        for (let j = 0; j < pose.keypoints.length; j++) {
            // A keypoint is an object describing a body part (like rightArm or leftShoulder)
            let keypoint = pose.keypoints[j];
            // Only draw an ellipse is the pose probability is bigger than 0.2
            if (keypoint.score > 0.25) {
                if( this.running) {
                    //this[keypoint.part].func(keypoint);
                    this.defaultDraw(keypoint);
                }
            }
        }
        }
    }
  
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
                this.canvas.line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
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
      

      nose(keypoint){
        defaultDraw(keypoint);
      }
      leftEye(keypoint){
        defaultDraw(keypoint);
      }
      rightEye(keypoint){
        defaultDraw(keypoint);
      }
      leftEar(keypoint){
        defaultDraw(keypoint);
      }
      rightEar(keypoint){
        defaultDraw(keypoint);
      }
      leftShoulder(keypoint){
        defaultDraw(keypoint);
      }
      rightShoulder(keypoint){
        defaultDraw(keypoint);
      }
      leftElbow(keypoint){
        defaultDraw(keypoint);
      }
      rightElbow(keypoint){
        defaultDraw(keypoint);
      }
      leftWrist(keypoint){
        defaultDraw(keypoint);
      }
      rightWrist(keypoint){
        defaultDraw(keypoint);
      }
      leftHip(keypoint){
        defaultDraw(keypoint);
      }
      rightHip(keypoint){
        defaultDraw(keypoint);
      }
      leftKnee(keypoint){
        defaultDraw(keypoint);
      }
      rightKnee(keypoint){
        defaultDraw(keypoint);
      }
      leftAnkle(keypoint){
        defaultDraw(keypoint);
      }
      rightAnkle(keypoint){
        defaultDraw(keypoint);
      }
}