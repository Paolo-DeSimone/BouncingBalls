alert("Move WASD to eat the balls!")

// set up canvas
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

const para = document.querySelector("p")

// function to generate random number
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// function to generate random RGB color value
function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

class Shape {
  constructor(x, y, velX, velY) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
  }
}

class Ball extends Shape {
  constructor(x, y, velX, velY, color, size) {
    super(x, y, velX, velY) // passo i valori al costruttore della classe padre
    this.color = color;
    this.size = size;
    this.exists = true
  }
  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }
  update() {
    if (this.x + this.size >= width) {
      this.velX = -Math.abs(this.velX);
    }

    if (this.x - this.size <= 0) {
      this.velX = Math.abs(this.velX);
    }

    if (this.y + this.size >= height) {
      this.velY = -Math.abs(this.velY);
    }

    if (this.y - this.size <= 0) {
      this.velY = Math.abs(this.velY);
    }

    this.x += this.velX;
    this.y += this.velY;
  }
  collisionDetect() {
    for (const ball of balls) {
      if (!(this === ball) && ball.exists) { // condizione (this === ball) negata con "!" perché una palla non può collidere con sé stessa
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
  
        if (distance < this.size + ball.size) {
          ball.color = this.color = randomRGB();
        }
      }
    }
  }
}

class EvilCircle extends Shape {
  constructor(x, y) {
    super(x,y,20,20)
    this.color = "white";
    this.size = 10;
    window.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "a":
          this.x -= this.velX;
          break;
        case "d":
          this.x += this.velX;
          break;
        case "w":
          this.y -= this.velY;
          break;
        case "s":
          this.y += this.velY;
          break;
      }
    });
  }
  draw() {
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.lineWidth = 3;
  }
  checkBounds(){
    if (this.x + this.size >= width) { // se il cerchio va oltre il bordo destro dello schermo
      this.x = width - this.size; 
    }

    if (this.x - this.size <= 0) { // se il cerchio va oltre il bordo sinistro dello schermo
      this.x = this.size;
    }

    if (this.y + this.size >= height) { // se il cerchio va oltre il bordo INFERIORE dello schermo (ctx con x ed y uguali a 0 significa il pixel in alto a sinistra delo schermo. Andando verso il basso, Y aumenta in positivo.)
      this.y = height - this.size;
    }

    if (this.y - this.size <= 0) { // se il cerchio va oltre il bordo SUPERIORE dello schermo
      this.y = this.size;
    }
  }
  collisionDetect() {
    for (const ball of balls) {
      if(ball.exists){
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
  
        if (distance < this.size + ball.size) {
          ball.exists = false
          eatenBalls++
        }
      }
      
    }
  }
}

const balls = [];

let eatenBalls = 0
let startingBalls = 25

while (balls.length < startingBalls) {
  const size = random(10, 20);
  const ball = new Ball(
    // ball position always drawn at least one ball width
    // away from the edge of the canvas, to avoid drawing errors
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-7, 7),
    random(-7, 7),
    randomRGB(),
    size
  );

  balls.push(ball);
}

const evilCircle = new EvilCircle(20,20)

function loop() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(0, 0, width, height);
  for (const ball of balls) {
    if(ball.exists === true){
      ball.draw();
      ball.update();
      ball.collisionDetect();
      evilCircle.draw();
      evilCircle.checkBounds();
      evilCircle.collisionDetect();
    }

  }
  para.innerHTML = startingBalls - eatenBalls
  if(startingBalls - eatenBalls == 0){
    alert("Hai vinto: la pagina verrà ricaricata per iniziare una nuova partita!")
    location.reload();
    return
  }
  else{
    requestAnimationFrame(loop);
  }
}

loop();
