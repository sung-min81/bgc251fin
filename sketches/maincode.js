const { Responsive } = P5Template;

let mode = 0;

let modeNames = ['Drawing', 'Emoji', 'Pixelate', 'Grayscale', '404 Not Found'];

let drawingPaths = [];

let currentPath = [];

let currentColor;

let particles = [];

let stickers = [];

let capture;

let particleShapes = [
  '⭐️',
  '❤️',
  '🍀',
  '😊',
  '🌈',
  '🔥',
  '❄️',
  '💡',
  '💎',
  '✨',
  '🐻',
  '👻',
  '🍉',
  '🦄',
  '🐱',
];

let stickerShapes = [
  'code',
  'coding',
  '[]',
  '<>',
  '{}',
  'https',
  'grapic',
  'design',
  '#401',
  'ERROR',
  '!--',
];

let monoEmojiShapes = [
  'ε=ε=ε=┏(゜ロ゜;)┛',
  'o(*////▽////*)q',
  '(☆▽☆)Σ',
  '(っ °Д °;)っ',
  'ಥ_ಥ',
  '╰(*°▽°*)╯',
  '(❁´◡`❁)',
  "(●'◡'●)",
  '(*/ω＼*)',
  '^_____^',
  '(≧▽≦)o',
];

function setup() {
  new Responsive().createResponsiveCanvas(1440, 1080, 'contain', true);
  capture = createCapture(VIDEO, () => {
    capture.hide();
  });
  capture.size(1440, 1080);
  textFont('Pretendard Variable, Pretendard, sans-serif');
  textStyle(BOLD);
  noFill();
  currentColor = getRandomColor();
}

function draw() {
  background(0);
  if (mode === 0) {
    drawCameraMirror();
    drawPaths(20);
  } else if (mode === 1) {
    drawCameraMirror();
    for (let p of particles) p.display();
  } else if (mode === 2) {
    drawCameraPixelateSquare();
  } else if (mode === 3) {
    drawCameraGray();
    drawPaths(20, true);
    for (let p of particles) p.display();
  } else if (mode === 4) {
    drawCameraMirror();
    for (let s of stickers) s.display();
  }
  drawTitle(modeNames[mode]);
}

function mousePressed() {
  if (mode === 0) {
    currentPath = [];
    drawingPaths.push({ path: currentPath, col: currentColor });
  } else if (mode === 3 && mouseButton === LEFT) {
    currentPath = [];
    let col = color('white');
    drawingPaths.push({ path: currentPath, col });
  } else if (mode === 1) {
    let col = color(255, 255, 255, 0);
    let shape = random(particleShapes);
    particles.push(new Particle(mouseX, mouseY, col, shape, true));
  } else if (mode === 2 && mouseButton === LEFT) {
    currentPath = [];
    drawingPaths.push({ path: currentPath, col: color(255) });
  } else if (mode === 3 && mouseButton === RIGHT) {
    particles.push(new MonoEmoji(mouseX, mouseY, random(monoEmojiShapes)));
  } else if (mode === 4) {
    stickers.push(
      new Sticker(
        mouseX,
        mouseY,
        random(stickerShapes),
        getRandomColorNoAlpha()
      )
    );
  }
}

function mouseDragged() {
  if (mode === 0) {
    let point = { x: mouseX, y: mouseY };
    currentPath.push(point);
  } else if (mode === 3 && mouseButton === LEFT) {
    let point = { x: mouseX, y: mouseY };
    currentPath.push(point);
  } else if (mode === 1) {
    let col = color(255, 255, 255, 0);
    let shape = random(particleShapes);
    particles.push(new Particle(mouseX, mouseY, col, shape, true));
  } else if (mode === 2 && mouseButton === LEFT) {
    let point = { x: mouseX, y: mouseY };
    currentPath.push(point);
  } else if (mode === 3 && mouseButton === RIGHT) {
    particles.push(new MonoEmoji(mouseX, mouseY, random(monoEmojiShapes)));
  } else if (mode === 4) {
    stickers.push(
      new Sticker(
        mouseX,
        mouseY,
        random(stickerShapes),
        getRandomColorNoAlpha()
      )
    );
  }
}

function mouseReleased() {
  if (mode === 0) currentColor = getRandomColor();
}

function drawPaths(strokeW = 5, isMonotone = false) {
  strokeCap(ROUND);
  for (let obj of drawingPaths) {
    let path = obj.path;
    let col = obj.col;
    for (let i = 1; i < path.length; i++) {
      stroke(col);
      strokeWeight(strokeW);
      line(path[i - 1].x, path[i - 1].y, path[i].x, path[i].y);
    }
  }
}

class Particle {
  constructor(x, y, col, shape, isEmoji = false) {
    this.x = x;
    this.y = y;
    this.col = col;
    this.shape = shape;
    this.size = 100;
    this.isEmoji = isEmoji;
  }
  display() {
    push();
    translate(this.x, this.y);
    if (this.isEmoji) {
      textAlign(CENTER, CENTER);
      textSize(this.size);
      noStroke();
      fill(255);
      textFont(
        'Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, Noto Emoji, sans-serif'
      );
      text(this.shape, 0, 0);
    } else {
      noStroke();
      fill(this.col);
      if (this.shape === '●') ellipse(0, 0, this.size);
      if (this.shape === '▲')
        triangle(
          0,
          -this.size / 2,
          this.size / 2,
          this.size / 2,
          -this.size / 2,
          this.size / 2
        );
      if (this.shape === '■')
        rect(-this.size / 2, -this.size / 2, this.size, this.size);
    }
    pop();
  }
}
class MonoEmoji {
  constructor(x, y, text) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.size = 46;
  }
  display() {
    push();
    translate(this.x, this.y);
    textAlign(CENTER, CENTER);
    textSize(this.size);
    fill(255);
    stroke(0);
    strokeWeight(4);
    textFont('Pretendard Variable, Pretendard, sans-serif');
    text(this.text, 0, 0);
    pop();
  }
}

function drawCameraPixelateSquare() {
  if (!capture.loadedmetadata) return;
  let px = 20;
  let nx = floor(width / px);
  let ny = floor(height / px);
  let camW = capture.width,
    camH = capture.height;
  capture.loadPixels();
  for (let y = 0; y < ny; y++) {
    for (let x = 0; x < nx; x++) {
      let srcX = Math.floor(map(x + 0.5, 0, nx, camW, 0));
      let srcY = Math.floor(map(y + 0.5, 0, ny, 0, camH));
      srcX = constrain(srcX, 0, camW - 1);
      srcY = constrain(srcY, 0, camH - 1);
      let idx = 4 * (srcY * camW + srcX);
      let r = capture.pixels[idx];
      let g = capture.pixels[idx + 1];
      let b = capture.pixels[idx + 2];
      fill(r, g, b);
      noStroke();
      rect(x * px, y * px, px, px);
    }
  }
}

function drawCameraGray() {
  push();
  translate(width, 0);
  scale(-1, 1);
  image(capture, 0, 0, width, height);
  loadPixels();
  for (let i = 0; i < pixels.length; i += 4) {
    let v = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
    pixels[i] = pixels[i + 1] = pixels[i + 2] = v;
  }
  updatePixels();
  pop();
}

class Sticker {
  constructor(x, y, type, col) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.col = col;
    this.size = random(45, 70);
  }
  display() {
    push();
    translate(this.x, this.y);
    noStroke();
    fill(this.col);
    textAlign(CENTER, CENTER);
    textSize(this.size / 1.8);
    textFont('Pretendard Variable, Pretendard, sans-serif');
    textStyle(BOLD);
    text(this.type, 0, 0);
    pop();
  }
}

function getRandomColor() {
  return color(random(255), random(255), random(255), 255);
}
function getRandomColorNoAlpha() {
  return color(random(255), random(255), random(255), 255);
}

function drawCameraMirror() {
  push();
  translate(width, 0);
  scale(-1, 1);
  image(capture, 0, 0, width, height);
  pop();
}

function drawTitle(str) {
  textSize(48);
  textAlign(LEFT, TOP);
  stroke(0);
  strokeWeight(8);
  fill(255);
  text(str, 32, 32);
  noStroke();
  fill(255);
  text(str, 32, 32);
}

function keyPressed() {
  if (key === '1') {
    mode = 0;
    drawingPaths = [];
    particles = [];
    stickers = [];
    currentColor = getRandomColor();
  }
  if (key === '2') {
    mode = 1;
    drawingPaths = [];
    particles = [];
    stickers = [];
  }
  if (key === '3') {
    mode = 2;
    drawingPaths = [];
    particles = [];
    stickers = [];
  }
  if (key === '4') {
    mode = 3;
    drawingPaths = [];
    particles = [];
    stickers = [];
  }
  if (key === '5') {
    mode = 4;
    drawingPaths = [];
    particles = [];
    stickers = [];
  }
  if (key === 'c' || key === 'C') {
    let name = `앨범_${modeNames[mode]}_${year()}${nf(month(), 2)}${nf(
      day(),
      2
    )}_${nf(hour(), 2)}${nf(minute(), 2)}${nf(second(), 2)}.png`;
    saveCanvas(name, 'png');
  }
  if (key === 'r' || key === 'R') {
    drawingPaths = [];
    particles = [];
    stickers = [];
  }
}

// 오른쪽 마우스 클릭 브라우저 메뉴 안뜨게 gpt 도움 코드
function contextMenuHandler(e) {
  e.preventDefault();
}
document.oncontextmenu = contextMenuHandler;
