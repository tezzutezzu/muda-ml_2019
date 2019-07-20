/*
- Callbacks and functions
*/

let imageLoaded = false;
let img;

function setup() {
  createCanvas(400, 400);
  img = loadImage("images/bird.jpg", onImageReady);
}

function onImageReady() {
  imageLoaded = true;

  img.loadPixels();

  // output  a "list" of all the colors of the pixels
  // the size will be width * height * number of channels (4 as it will be RGBA)
  console.log(img.pixels);

  // wouldn't it be cool if the computer could tell me more about the pixel in this image?
  // enter machine learning!
}

function draw() {
  if (imageLoaded === true) {
    image(img, 0, 0, 400, 400);
  }
}
