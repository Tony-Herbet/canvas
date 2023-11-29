// Initializing canvas
const canvas = document.querySelector('canvas');
let c = canvas.getContext('2d');

// Canvas size
canvas.width = innerWidth;
canvas.height = innerHeight;

// Canvas center
const center = {
  x: canvas.width / 2,
  y: canvas.height / 2
};

// Resize listener
addEventListener('resize', () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  init();
});

// Object
class Line {
  constructor(sx, sy, ex, ey) {
    this.sx = sx;
    this.sy = sy;
    this.ex = ex;
    this.ey = ey;
  }

  draw() {
    c.beginPath();
    c.moveTo(this.sx, this.sy);
    c.lineTo(this.ex, this.ey);
    c.strokeStyle = "blue";
    c.stroke();
    c.closePath();
  }

  update() {
    this.draw();
  }
}

// Implementation
let verticalLines;
let horizontalLines;

// TODO rewrite math
function init() {
  c.clearRect(0, 0, canvas.width, canvas.height);
  // Vertical Lines 
  verticalLines = [];
  for (let i = 0; i < canvas.width / 100; i++) {
    const sx = 5 + (i * 100);
    const sy = canvas.height;
    const ex = sx;
    const ey = center.y;
    verticalLines.push(new Line(sx, sy, ex, ey));
  }
  verticalLines.forEach(verticalLine => {
    verticalLine.update();
  });
  // Horizontal Lines
  horizontalLines = [];
  for (let i = 0; i < center.y / 100; i++) {
    const sx = 0;
    const sy = canvas.height - (i * 100) - 5;
    const ex = canvas.width;
    const ey = sy;
    horizontalLines.push(new Line(sx, sy, ex, ey));
  }
  horizontalLines.forEach(horizontalLine => {
    horizontalLine.update();
  })

}

// Animation Loop
function animation() {
  requestAnimationFrame(animation);
  c.clearRect(0, 0, canvas.width, canvas.height);
}

init();
//animation();
