/*
- Folder structure 
- Console.log
- Don't worry about the syntax for now! Ask for help if you get stuck :)
- createCanvas
- Reference: https://p5js.org/reference/
- Drawing functions
- variables
- Fills, strokes and color modes, 
*/


function setup() {
  createCanvas(400, 400);

  square(10, 10, 50);
  fill(255, 0, 0);
  noStroke();
  circle(100, 10 + 25, 25);

  let radius = 25;
  let y = 80;
  let x = radius + 10;
  colorMode(HSB);

  fill(120, 100, 50);
  circle(x, y + radius, radius);
  fill(240, 100, 50);
  ellipse(x + radius + radius * 2 + 10, y + radius, radius * 4, radius * 2);
}

