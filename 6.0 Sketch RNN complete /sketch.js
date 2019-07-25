//https://magenta.tensorflow.org/assets/sketch_rnn_demo/index.html
//https://magenta.tensorflow.org/assets/sketch_rnn_demo/multi_predict.html

const sketchiz = [];
let models = [];
let seedStrokes = [];
let drawStrokes = [];
let drawSketches = false;
let ready = false;
let loadedCounter = 0;
let currentIndex = 0;
let startPosition = null;

function setup() {
  canvas = createCanvas(window.innerWidth - 20, window.innerHeight);
  animals.forEach((d, i) => {
    models.push(ml5.sketchRNN(d, onModelLoaded));
  });
  textFont("Bahnschrift");
  textAlign(CENTER);
  textSize(25);
  strokeWeight(10);
}

function onModelLoaded() {
  loadedCounter++;
  draw();
  if (loadedCounter === animals.length) {
    onModelsLoaded();
  }
}

function onModelsLoaded() {
  models.forEach((d, i) => {
    sketchiz.push(
      new LilSketch(
        d,
        `hsl(${round((i / models.length) * 360)}, 50%,50%)`,
        onDrawCompleted
      )
    );
  });
  ready = true;
}

function mousePressed() {
  currentIndex = 0;
  drawStrokes = [];
  seedStrokes = [];
  startPosition = { x: mouseX, y: mouseY };
}

function mouseReleased() {
  if (mouseY < 40 || pmouseY < 40) return;
  sketchiz.forEach(d => d.reset());
  sketchiz.forEach(d => d.changeSeeds(seedStrokes));
  drawSketches = true;
}

function onDrawCompleted() {
  sketchiz[currentIndex].reset();
  currentIndex++;
  currentIndex %= models.length;
}

function draw() {
  background(0);
  if (!ready) {
    fill(255);
    text(`loading ${loadedCounter} / ${animals.length}`, width / 2, height / 2);
  } else {
    stroke("#ddd");

    if (mouseIsPressed) {
      if (mouseY < 40 || pmouseY < 40) return;

      let userStroke = {
        dx: mouseX - pmouseX,
        dy: mouseY - pmouseY,
        pen: "down"
      };
      seedStrokes.push(userStroke);
      drawStrokes.push([pmouseX, pmouseY, mouseX, mouseY]);
      drawStrokes.forEach(d => line(...d));
    } else {
      if (drawSketches) {
        drawStrokes.forEach(d => line(...d));
        sketchiz[currentIndex].draw();
      }
    }
  }
}

class LilSketch {
  constructor(model, color, onCompleted) {
    this.model = model;
    this.pen = "down";
    this.completed = false;
    this.lines = [];
    this.color = color;
    this.onCompleted = onCompleted;
    this.y = 0;
    this.x = 0;
  }

  changeSeeds(seedStrokes) {
    this.seedStrokes = seedStrokes;
    this.generate();
  }

  reset() {
    this.model.reset();
    this.strokePath = null;
    this.lines = [];
    this.completed = false;
    this.x = 0;
    this.y = 0;
    this.generate();
  }

  draw() {
    fill(this.color);
    noStroke();
    text(this.model.model.info.name, width / 2, 30);
    noFill();
    stroke(this.color);
    push();
    translate(startPosition.x, startPosition.y);
    this.lines.forEach(d => line(...d));
    pop();

    const { strokePath, x, y, pen } = this;

    if (strokePath != null) {
      let newX = x + strokePath.dx;
      let newY = y + strokePath.dy;
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
        if (this.lines.length <= 1) {
          // weird
          this.reset();
        } else {
          this.completed = true;
          setTimeout(this.onCompleted, 1000);
        }
      }
    }
  }

  generate() {
    this.model.generate(
      { temperature: 0.7, pixelFactor: 2 },
      this.seedStrokes,
      this.gotStroke
    );
  }

  gotStroke = (err, s) => {
    this.strokePath = s;
  };
}
