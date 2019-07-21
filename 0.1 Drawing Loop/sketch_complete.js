/*
- draw loop
- P5 built-in variable
- global variables
- background function 
*/

let counter = 0;

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(255, 255, 255);
  circle(mouseX, mouseY, 30);
}
