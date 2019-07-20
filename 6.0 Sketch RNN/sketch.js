const sketchiz = [];
let seedStrokes = [];
let drawStrokes = [];

function setup() {
  canvas = createCanvas(700, 500);
  animals.forEach((d, i) => {
    sketchiz.push(
      new LilSketch(d, (i % 4) * 100 + 150, Math.floor(i / 4) * 100 + 150)
    );
  });

  background(220);
  textSize(40);
}

function mousePressed() {}

function mouseReleased() {
  sketchiz.forEach(d => d.reset());
  sketchiz.forEach(d => d.changeSeeds(seedStrokes));
  seedStrokes = [];
  drawStrokes = [];
}

function draw() {
  background(255);
  stroke(0);

  if (mouseIsPressed) {
    let userStroke = {
      dx: mouseX * 0.2 - pmouseX * 0.2,
      dy: mouseY * 0.2 - pmouseY * 0.2,
      pen: "down"
    };
    seedStrokes.push(userStroke);
    drawStrokes.push([pmouseX, pmouseY, mouseX, mouseY]);
    drawStrokes.forEach(d => line(...d));
  } else {
    sketchiz.forEach(d => {
      d.draw();
    });
  }
}

class LilSketch {
  constructor(path, x, y) {
    this.model = ml5.sketchRNN(path, this.onReady);
    this.ox = this.x = x;
    this.oy = this.y = y;
    this.pen = "down";
    this.lines = [];
  }

  changeSeeds(seedStrokes) {
    // this.seedStrokes = null;
    this.seedStrokes = seedStrokes;
    this.generate();
  }

  reset() {
    this.model.reset();
    this.lines = [];
    this.x = this.ox;
    this.y = this.oy;
  }
  onReady = () => {
    this.ready = true;
  };

  draw() {
    if (!this.ready) return;

    stroke(0);
    strokeWeight(2);
    this.lines.forEach(d => line(...d));

    const { strokePath, x, y, pen } = this;
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
        console.log("completed");
      }
    }
  }
  generate() {
    this.model.generate(this.seedStrokes, this.gotStroke);
  }

  gotStroke = (err, s) => {
    this.strokePath = s;
  };
}
