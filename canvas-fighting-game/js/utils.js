function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      rectangle2.position.x &&
    rectangle1.attackBox.position.x <=
      rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
      rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  );
}

function determineWInner({ player1, player2, timerId }) {
  clearTimeout(timerId);
  if (player1.health === player2.health) {
    document.querySelector("#result").innerHTML = "Tie";
    if (player1.health === 0 && player2.health === 0) {
      player1.switchSprite("death");
      player2.switchSprite("death");
    }
  } else if (player1.health > player2.health) {
    document.querySelector("#result").innerHTML = "player 1 Wins";
  } else if (player2.health > player1.health) {
    document.querySelector("#result").innerHTML = "player 2 Wins";
  }
  document.querySelector("#result").style.display = "flex";
}

let timer = 61;
let timerId;

function decreaseTimer() {
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000);
    timer--;
    document.querySelector("#timer").innerHTML = timer; // setHTML instead for real project
  }

  if (timer === 0) {
    determineWInner({ player1, player2, timerId });
  }
}
