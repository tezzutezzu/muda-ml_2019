/*
- Preload function: everything waits until this is loaded
- pixels and arrays 
*/

let img;

function preload() {
  img = loadImage("images/bird.jpg");
}

function setup() {
  createCanvas(400, 400);
  img.loadPixels();
  // output  a "list" of all the colors of the pixels 
  // the size will be width * height * number of channels (4 as it will be RGBA)
  console.log(img.pixels); 
}

function draw() {
  image(img, 0, 0, 400, 400);
}
