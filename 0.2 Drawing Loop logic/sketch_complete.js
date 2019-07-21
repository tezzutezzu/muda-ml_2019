/*
- logic
*/
function setup() {
  createCanvas(400, 400);
}

function draw() {
  if (mouseX < 100) {
    fill("red");
  } else if (mouseX > 100 && mouseX < 200) {
    fill("yellow");
  } else {
    fill("green");
  }

  circle(mouseX, mouseY, 50);
}
