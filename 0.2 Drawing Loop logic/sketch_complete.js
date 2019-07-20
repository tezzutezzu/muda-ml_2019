/*
- global variables
- logic
*/

var counter = 0;

function setup() {
  createCanvas(400, 400);
  colorMode(HSB);
  noStroke();
}

function draw() {
  background(255);
  counter += 1;
  if (counter > 255) counter = 0;
  fill(counter, 50, 50);
  if (mouseIsPressed) {
    circle(mouseX, mouseY, 30);
  } else {
    circle(mouseX, mouseY, 50);
  }
}
