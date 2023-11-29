const canvas = document.querySelector('canvas');

// canvas context
const c = canvas.getContext('2d');

// // ---------------------------------------- Square ----------------------------------------
// // Color
// c.fillStyle = "rgba(255, 0, 0, 0.5";
// // Size & position
// c.fillRect(100, 100, 100, 100);
// // Take the fillStyle above
// c.fillStyle = "rgba(0, 0, 255, 0.5";
// c.fillRect(400, 100, 100, 100);
// c.fillStyle = "rgba(0, 255, 0, 0.5";
// c.fillRect(300, 300, 100, 100);

// // ---------------------------------------- Line ----------------------------------------
// // Start process
// c.beginPath();
// // Starting point
// c.moveTo(50, 300);
// // Next point
// c.lineTo(300, 100);
// c.lineTo(400, 300);
// // Color the line
// c.strokeStyle = "#fa34a3";
// // Draw the line
// c.stroke();

// // ---------------------------------------- Arc/Circle ----------------------------------------
// // Start process, reuse to avoid connection to last path initialize
// // c.beginPath();
// // c.arc(300, 300, 30, 0, Math.PI * 2 /*Full circle*/, false);
// // c.strokeStyle = "blue";
// // c.stroke();

// // Create multiple circle
// for (let i = 0; i < 7; i += 1) {
//   // Randomize position, Multiply by the window.inner to use the full screen instead of been stuck top left
//   const x = Math.random() * window.innerWidth;
//   const y = Math.random() * window.innerHeight;
//   // Circle creation
//   c.beginPath();
//   c.arc(x, y, 30, 0, Math.PI * 2 /*Full circle*/, false);
//   c.strokeStyle = 'blue';
//   c.stroke();
// };

// ---------------------------------------- Animation ----------------------------------------

// Initialize mouse position
let mouse = {
  x: undefined,
  y: undefined,
};
// max radius of our circles
let maxRadius = 40;

// Colors
let colorArray = [
  '#2C3E50',
  '#E74C3C',
  '#ECF0F1',
  '#3498D8',
  '#2980B9',
];

// Listener on mouse movement
window.addEventListener('mousemove', function (event) {
  mouse.x = event.x;
  mouse.y = event.y;
});
// Listerner to resize
window.addEventListener('resize', function () {
  // Use full screen
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  init();
})

// Circle object
function Circle(x, y, dx, dy, radius) {
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.radius = radius;
  this.minRadius = radius;
  this.color = colorArray[Math.floor(Math.random() * colorArray.length)];

  // Draw the circle when call
  this.draw = function () {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2 /*Full circle*/, false);
    // Circle border color
    // c.strokeStyle = 'blue';
    c.stroke();
    // Circle inner color from our color array
    c.fillStyle = this.color;
    c.fill();
  };

  // Update the circle
  this.update = function () {
    // Bouncing on x condition
    if (this.x + this.radius > innerWidth /*Bounce when outer circle touch the right screen border*/ || this.x - this.radius < 0 /*Bounce left screen border */) {
      // Reverse velocity
      this.dx = -this.dx;
    }
    // Bouncing on y condition
    if (this.y + this.radius > innerHeight /*Bounce when outer circle touch the bottom screen border*/ || this.y - this.radius < 0 /*Bounce top screen border */) {
      // Reverse velocity
      this.dy = -this.dy;
    }
    // Increment axis by velocity to move the cicle on axis at the chosen speed
    this.x += this.dx;
    this.y += this.dy;

    // Interactivity with mouse
    // Compare mouse position with circles position
    if (mouse.x - this.x < 50 && mouse.x - this.x > -50 && mouse.y - this.y < 50 && mouse.y - this.y > -50) {
      // Limitation on growth
      if (this.radius < maxRadius) {
        this.radius += 1;
      }
      // Reverse growth
    } else if (this.radius > this.minRadius) {
      this.radius -= 1;
    }
    // Draw circle
    this.draw();
  }
}


// Will store our circles
let circleArray = [];

function init() {
  // Reset our array
  circleArray = [];
  // Create our circles
  for (let i = 0; i < 500; i += 1) {
    // Circle radius
    let radius = Math.random() * 3 + 1 /* beetween 1 & 4 */;
    // Initialize x axis value
    let x = Math.random() * (innerWidth - radius * 2) + radius /* Ensure circle dont generate in the screen border*/;
    // Initialize y axis value
    let y = Math.random() * (innerHeight - radius * 2) + radius /* Ensure circle dont generate in the screen border*/;
    // x velocity 
    let dx = (Math.random() - 0.5 /* beetween -0.5 & 0.5 */);
    // y velocity
    let dy = (Math.random() - 0.5 /* beetween -0.5 & 0.5 */);
    // Push a new circle
    circleArray.push(new Circle(x, y, dx, dy, radius))
  }
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  // clear all canvas to remove previous circle
  c.clearRect(0, 0, innerWidth, innerHeight);
  // Create circle for each circle in our array
  for (let i = 0; i < circleArray.length; i += 2) {
    circleArray[i].update();
  }
}

// Start the animation
init();
animate();