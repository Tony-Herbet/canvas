const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

const gravity = 0.7;

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/background.png",
});

const shop = new Sprite({
  position: {
    x: 625,
    y: 128,
  },
  imageSrc: "./img/shop.png",
  scale: 2.75,
  framesMax: 6,
});

const player1 = new Fighter({
  position: {
    x: 100,
    y: 150,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/samuraiMack/Idle.png",
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 157,
  },
  sprites: {
    idle: {
      imageSrc: "./img/samuraiMack/Idle.png",
      framesMax: 8,
    },
    run: {
      imageSrc: "./img/samuraiMack/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./img/samuraiMack/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./img/samuraiMack/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./img/samuraiMack/Attack1.png",
      framesMax: 6,
    },
    takeHit: {
      imageSrc: "./img/samuraiMack/Take Hit - white silhouette.png",
      framesMax: 4,
    },
    death: {
      imageSrc: "./img/samuraiMack/Death.png",
      framesMax: 6,
    },
  },
  attackBox: {
    offset: {
      x: 100,
      y: 50,
    },
    width: 160,
    height: 50,
  },
});

const player2 = new Fighter({
  position: {
    x: canvas.width - 150,
    y: 150,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: -50,
    y: 0,
  },
  imageSrc: "./img/kenji/Idle.png",
  framesMax: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 167,
  },
  sprites: {
    idle: {
      imageSrc: "./img/kenji/Idle.png",
      framesMax: 4,
    },
    run: {
      imageSrc: "./img/kenji/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./img/kenji/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./img/kenji/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./img/kenji/Attack1.png",
      framesMax: 4,
    },
    takeHit: {
      imageSrc: "./img/kenji/Take Hit.png",
      framesMax: 3,
    },
    death: {
      imageSrc: "./img/kenji/Death.png",
      framesMax: 7,
    },
  },
  attackBox: {
    offset: {
      x: -165,
      y: 50,
    },
    width: 165,
    height: 50,
  },
});

const keys = {
  q: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
};

decreaseTimer();

function animate() {
  window.requestAnimationFrame(animate);

  background.update();
  shop.update();

  // white effect to see players more
  c.fillStyle = "rgba(255,255,255, 0.13)";
  c.fillRect(0, 0, canvas.width, canvas.height);

  player1.update();
  player2.update();

  player1.velocity.x = 0;
  player2.velocity.x = 0;

  // player1 movement
  if (
    keys.q.pressed &&
    player1.lastKey === "q" &&
    player1.position.x > 0 // screen border
  ) {
    player1.velocity.x = -2;
    player1.switchSprite("run");
  } else if (
    keys.d.pressed &&
    player1.lastKey === "d" &&
    player1.position.x < canvas.width - player1.width // screen border
  ) {
    player1.velocity.x = 2;
    player1.switchSprite("run");
  } else {
    player1.switchSprite("idle");
  }

  // jumping
  if (player1.velocity.y < 0) {
    player1.switchSprite("jump");
  } else if (player1.velocity.y > 0) {
    player1.switchSprite("fall");
  }

  // player2 movement
  if (
    keys.ArrowLeft.pressed &&
    player2.lastKey === "ArrowLeft" &&
    player2.position.x > 0 // screen border
  ) {
    player2.velocity.x = -2;
    player2.switchSprite("run");
  } else if (
    keys.ArrowRight.pressed &&
    player2.lastKey === "ArrowRight" &&
    player2.position.x < canvas.width - player2.width // screen border
  ) {
    player2.velocity.x = 2;
    player2.switchSprite("run");
  } else {
    player2.switchSprite("idle");
  }

  // jumping
  if (player2.velocity.y < 0) {
    player2.switchSprite("jump");
  } else if (player2.velocity.y > 0) {
    player2.switchSprite("fall");
  }

  // detect collision & get hit
  if (
    rectangularCollision({
      rectangle1: player1,
      rectangle2: player2,
    }) &&
    player1.isAttacking &&
    player1.framesCurrent === 4
  ) {
    player1.isAttacking = false;
    player2.takeHit();
    // document.querySelector("#player2Health").style.width = player2.health + "%";
    gsap.to("#player2Health", { width: player2.health + "%" });
  }

  // if player1 misses
  if (player1.isAttacking && player1.framesCurrent === 4) {
    player1.isAttacking = false;
  }

  if (
    rectangularCollision({
      rectangle1: player2,
      rectangle2: player1,
    }) &&
    player2.isAttacking &&
    player2.framesCurrent === 2
  ) {
    player2.isAttacking = false;
    player1.takeHit();
    // document.querySelector("#player1Health").style.width = player1.health + "%";
    gsap.to("#player1Health", { width: player1.health + "%" });
  }

  // if player2 misses
  if (player2.isAttacking && player2.framesCurrent === 2) {
    player2.isAttacking = false;
  }

  // end game based on health
  if (player2.health <= 0 || player1.health <= 0) {
    determineWInner({ player1, player2, timerId });
  }
}

animate();

window.addEventListener("keydown", (event) => {
  if (!player1.dying) {
    switch (event.key) {
      case "d":
        keys.d.pressed = true;
        player1.lastKey = "d";
        break;
      case "q":
        keys.q.pressed = true;
        player1.lastKey = "q";
        break;
      case "z":
        player1.jump();
        break;
      case " ":
        player1.attack();
        break;
    }
  }

  if (!player2.dying) {
    switch (event.key) {
      case "ArrowRight":
        keys.ArrowRight.pressed = true;
        player2.lastKey = "ArrowRight";
        break;
      case "ArrowLeft":
        keys.ArrowLeft.pressed = true;
        player2.lastKey = "ArrowLeft";
        break;
      case "ArrowUp":
        player2.jump();
        break;
      case "ArrowDown":
        player2.attack();
        break;
    }
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    // player1 keys
    case "d":
      keys.d.pressed = false;
      break;
    case "q":
      keys.q.pressed = false;
      break;
    // player2 keys
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
  }
});
