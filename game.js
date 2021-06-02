class Space {
  constructor(image, y) {
    this.x = 0;
    this.y = y;
    this.loaded = false;
    this.image = new Image();
    let obj = this;
    this.image.addEventListener("load", function () { obj.loaded = true; });
    this.image.src = image;
  }
  Update(space) {
    this.y += speed; 
    if(this.y > window.innerHeight) {
      this.y = space.y - canvas.width + speed; 
    }
  }
}

class Rocket{
  constructor(image, x, y, isPlayer, collectable, hitt) {
    this.x = x;
    this.y = y;
    this.loaded = false;
    this.dead = false;
    this.isPlayer = isPlayer;
    this.collectable = collectable;
    this.hitt = hitt;
    this.image = new Image();
    let obj = this;
    this.image.addEventListener("load", function () { obj.loaded = true; });
    this.image.src = image;
  }

  Update() {
    if(!this.isPlayer) {
      this.y += speed;
    }
    if(this.y > canvas.height + 50) {
      this.dead = true;
    }
  }

  Collide(rocket) {
    let hit = false;
    if(this.y < rocket.y + rocket.image.height * scale && this.y + this.image.height * scale > rocket.y) {
      if(this.x + this.image.width * scale > rocket.x && this.x < rocket.x + rocket.image.width * scale) {
        hit = true;
      }
    }

    return hit;
  }
  Move(v, d)  {
    if(v == "x")  {
      d *= 2;
      this.x += d; 
      if(this.x + this.image.width * scale > canvas.width) {
        this.x -= d; 
      }
      if(this.x < 0) {
        this.x = 0;
      }
    }
     else  {
      this.y += d;
       if(this.y + this.image.height * scale > canvas.height) {
        this.y -= d;
      }
       if(this.y < 0) {
        this.y = 0;
      }
    }
  }
}
const UPDATE_TIME = 1000 / 60;
let timer = null;
let canvas = document.getElementById("canvas"); 
let ctx = canvas.getContext("2d"); 
let scale = 0.1; 
Resize(); 
window.addEventListener("resize", Resize); 
canvas.addEventListener("contextmenu", function (e) { e.preventDefault(); return false; }); 
window.addEventListener("keydown", function (e) { KeyDown(e); }); 
let objects = []; 
let spaces = [
  new Space("images/space.png", 0),
  new Space("images/space.png", canvas.width)
]; 
let player = new Rocket("images/rocket.png", canvas.width /2, canvas.height /2, true, false, true); 
let speed = 5;
Start();
function Start() {
  if(!player.dead) {
    timer = setInterval(Update, UPDATE_TIME); 
  }
}
function Stop() {
  clearInterval(timer); 
  timer = null;
}
function Update() {
  spaces[0].Update(spaces[1]);
  spaces[1].Update(spaces[0]);
  if(RandomInteger(0, 10000) > 9700) {
    objects.push(new Rocket("images/meteorite.png", RandomInteger(30, canvas.width - 50), RandomInteger(250, 400) * -1, false, false, true ));
    objects.push(new Rocket("images/coins.png", RandomInteger(30, canvas.width - 50), RandomInteger(250, 400) * -1, false, true, false ));
  }
  player.Update();
  if(player.dead) {
    alert("Вы врезались!!!");
    Stop();
  }
 let isDead = false; 
 for(let i = 0; i < objects.length; i++) {
    objects[i].Update();
    if(objects[i].dead) {
      isDead = true;
    }
  }
  if(isDead) {
    objects.shift();
  }
  let hit = false;
  for(let i = 0; i < objects.length; i++) {
    hit = player.Collide(objects[i]);
    if(hit && objects[i].hitt) {
      alert("Вы врезались!!! \n\Ваш счет: " + counter);
      Stop();
      player.dead = true;
      break;
    }
    else if (hit && objects[i].collectable) {
      hit = false;
      objects.splice(i, 1);
      counter+=1;
      console.log(counter);
       }
  }

  Draw();
}
let counter = 0;
function Draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); 

  for(let i = 0; i < spaces.length; i++) {
    ctx.drawImage (
      spaces[i].image, 
      0,
      0, 
      spaces[i].image.width, 
      spaces[i].image.height, 
      spaces[i].x, 
      spaces[i].y,
      canvas.width, 
      canvas.width 
    );
  }

  DrawRocket(player);

  for(let i = 0; i < objects.length; i++) {
    DrawRocket(objects[i]);
  }
}
function DrawRocket(rocket) {
  ctx.drawImage (
    rocket.image, 
    0, 
    0, 
    rocket.image.width, 
    rocket.image.height, 
    rocket.x, 
    rocket.y, 
    rocket.image.width * scale, 
    rocket.image.height * scale 
  );
}

function KeyDown(e) {
  switch(e.keyCode) {
    case 37:
      player.Move("x", -speed);
      break;

    case 39: 
      player.Move("x", speed);
      break;

    case 38:
      player.Move("y", -speed);
      break;

    case 40: 
      player.Move("y", speed);
      break;

    case 27: 
      if(timer == null) {
        Start();
      }
      else {
        Stop();
      }
      break;
  }
}

function Resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function RandomInteger(min, max) {
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}
