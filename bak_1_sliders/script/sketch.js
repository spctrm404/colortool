function setup() {
  createCanvas(400, 400);
  background(220);
  noStroke();
  colorMode('oklch');
  let colourOklch = color(0.84, 0.35, 145, 1);
  fill(colourOklch);
  rect(0, 0, width / 2, height);
  colorMode('rgb');
  let colourRgb = '#00f445';
  fill(colourRgb);
  rect(width / 2, 0, width / 2, height);
}

function draw() {}
