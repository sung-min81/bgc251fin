const { Responsive } = P5Template;

function setup() {
  new Responsive().createResponsiveCanvas(800, 600, 'fill', false);
}

function draw() {
  background('#000000');
  noStroke();
  fill('red');
  circle(mouseX, mouseY, 100);
  Responsive.drawReferenceGrid('pink');
}
