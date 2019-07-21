let img;

function preload() {
  img = loadImage("images/bird.jpg");
}

function setup() {
  createCanvas(400, 400);
  img.loadPixels();
}

function draw() {
  image(img, 0, 0, 400, 400);
}
