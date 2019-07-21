/*
- Explain what P5 is, what a P5 sketch is
- Reference: https://p5js.org/reference/
- Folder structure 
- Console.log
- Don't worry about the syntax for now! Ask for help if you get stuck :)
- createCanvas
- P5 built-in functions
- draw square function
- variables and scope
- draw circle function
- Fills, strokes 
*/

function setup() {
  createCanvas(400, 400);

  let size = 100;
  let startX = 10;

  createCanvas(400, 800);
  square(startX, 10, size);

  fill(0);
  square(startX, size + 10, size);

  fill("red");
  square(startX + size, 10, size);

  fill("blue");
  noStroke();
  circle(startX + 50 + size, size + 10 + size / 2, size);
}
