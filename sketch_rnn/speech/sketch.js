const sketchiz = [];

function setup() {
  canvas = createCanvas(700, 500);
  sketchiz.push(new LilSketch("cat", 200, 100));
  sketchiz.push(new LilSketch("dog", 650, 100));
  background(220);
  textSize(40);
}

function startSketchRNN(animal) {
  models[animal].generate(seedStrokes, gotStroke);
}

function draw() {
  background(255);
  noStroke();
  text("the quick          jumps over the lazy      ", 0, 120);
  sketchiz.forEach(d => {
    d.draw();
  });
}

class LilSketch {
  constructor(path, x, y) {
    this.model = ml5.sketchRNN(path, this.onReady);
    this.ox = this.x = x;
    this.oy = this.y = y;
    this.pen = "down";
    this.lines = [];
  }

  onReady = () => {
    this.ready = true;
    this.model.generate(this.gotStroke);
  };

  draw() {
    if (!this.ready) return;
    const { strokePath, x, y, pen } = this;
    stroke(0);
    strokeWeight(2);
    this.lines.forEach(d => line(...d));

    if (strokePath != null) {
      let newX = x + strokePath.dx * 0.2;
      let newY = y + strokePath.dy * 0.2;
      if (pen === "down") {
        this.lines.push([x, y, newX, newY]);
      }

      this.pen = strokePath.pen;
      this.strokePath = null;
      this.x = newX;
      this.y = newY;

      if (pen !== "end") {
        this.model.generate(this.gotStroke);
      } else {
        if (!this.waiting) {
          this.waiting = true;
          setTimeout(() => {
            this.waiting = false;
            this.lines = [];
            this.x = this.ox;
            this.y = this.oy;
            this.model.reset();
            this.model.generate(this.gotStroke);
            console.log("resetting");
          }, 500);
          console.log("drawing complete");
        }
      }
    }
  }

  gotStroke = (err, s) => {
    this.strokePath = s;
  };
}
