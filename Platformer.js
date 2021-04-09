//Game Runtime Configurer
var Playing = true

//Canvas and Game Console
var canvas = document.getElementById("game-canvas")
var subtile = document.getElementsByClassName("subtitle")[0]
canvas.width = document.body.clientWidth
canvas.height = window.innerHeight
var canPos = canvas.getBoundingClientRect()
var ctx = canvas.getContext("2d")
var SceneWidth = canvas.width
var SceneHeight = canvas.height
var CenterX = SceneWidth/2
var CenterY = SceneHeight/2
var Notes = ["Use the W A S D keys to Navigate", "You can Wall Jump on these Blocks",]
var Progress = 0

//Player Variables
var Player = {
    x: 0,
    y: 0,
    xv: 0,
    yv: 0,
    wh: 50,
    TouchGround: false,
    TouchWall: false,
    TouchSpikes: false,
    Jumped: false,
    Gravity: 1,
    Speed: 2,
    JumpHeight: 17,
    SetGravity: function (value) {
      this.Gravity = value
    },
    SetSpeed: function (value) {
      this.Speed = value
    },
    SetJumpHeight: function (value) {
      this.JumpHeight = value
    },
    GoTo: function (xpos, ypos) {
      this.x = xpos
      this.y = ypos * -1
    },
}
CosIdle = "Images/Samuraininja Idle.svg"
CosRight = "Images/Samuraininja Right.svg"
CosLeft = "Images/Samuraininja Left.svg"
CosUp = "Images/Samuraininja Up.svg"

//Camera Settings
var Cam = {
    x: 0,
    y: 0,
}

//Mouse Settings
var Mouse = {
    x: 0,
    y: 0,
}
window.addEventListener("mousemove", function (e) {
    Mouse.x = e.x - (canPos.x + canPos.width/2)
    Mouse.y = e.y - (canPos.y + canPos.height/2)
})

//Map Variables
var Ground = [[0,100,100,100],[-100,100,100,100],[-200,100,100,100],]
var Wall = [[]]
var Spikes = []

var Spikes = {
  width: 100,
  height: 50,
}

//Bullets
var Bullets = []
var BulletImg = new Image()
var Fireball = "Images/Fireball.svg"
BulletImg.src = Fireball
var Tick = 0
/*Bullet = {
  x: Player.x,
  y: Player.y,
  width: 40,
  height: 10,
  Draw: function () {
    BulletImg.src = "Images/Bullet.svg"
    ctx.drawImage(BulletImg, this.x + CenterX - this.width/2 - Cam.x, this.y + CenterY - this.height/2 - Cam.y, this.width, this.height)
  },
}*/

//Guns
var Gun = {
  Damage: 20,
  Speed: 20,
  Reload: 10,
}

//Pre-defined Colors
var white = "rgb(255,255,255)"
var black = "rgb(0,0,0)"
var blue = "rgb(0,100,255)"
var red = "rgb(255,50,50)"
var gold = "rgb(255,200,0)"

//Keys
var keyW = false
var keyA = false
var keyS = false
var keyD = false
var keyE = false
var keyQ = false
var keySpace = false
var keyCTRL = false
var mousedown = false

//Rules and Settings
var Hangable = false

//Defining Game Functions
window.addEventListener("keydown", onKeyDown, false)
window.addEventListener("keyup", onKeyUp, false)
window.addEventListener("click", onClick, false)
window.addEventListener("mousedown", onMousedown, false)
window.addEventListener("mouseup", onMouseup, false)

function onClick () {

}

function onMousedown () {
  mousedown = true
}

function onMouseup () {
  mousedown = false
}

function onKeyDown (event) {
  var keyCode = event.keyCode;
  switch(keyCode){
    case 68:  
      keyD = true
    break
    case 83:  
      keyS = true
    break
    case 65:  
      keyA = true
    break
    case 87:
      keyW = true
    break
    case 81:
      keyQ = true
    break
    case 69:
      keyE = true
    break
    case 32:
      keySpace = true
    break
    case 17:
      keyCTRL = true
  }
}

function onKeyUp (event) {
  var keyCode = event.keyCode
  switch(keyCode){
    case 68:  
      keyD = false
    break
    case 83:  
      keyS = false
    break
    case 65:  
      keyA = false
    break
    case 87:
      keyW = false
    case 81:
      keyQ = false
    break
    case 69:
      keyE = false
    break
    case 32:
      keySpace = false
    break
    case 17:
      keyCTRL = false
  }
}

function PlayerCollision (object) {
  for (i=0; i<object.length; i++) {
    var collider = object[i]
    if (object === Ground) {
      if (Player.x + Player.wh/2 > collider[0] - collider[2]/2 && Player.x - Player.wh/2 < collider[0] + collider[2]/2 && Player.y + Player.wh/2 > collider[1] - collider[3]/2 && Player.y - Player.wh/2 < collider[1] + collider[3]/2) {
        Player.TouchGround = true
        break
      } else {
        Player.TouchGround = false
      }
    } else if (object === Wall) {
      if (Player.x + Player.wh/2 > collider[0] - collider[2]/2 && Player.x - Player.wh/2 < collider[0] + collider[2]/2 && Player.y + Player.wh/2 > collider[1] - collider[3]/2 && Player.y - Player.wh/2 < collider[1] + collider[3]/2) {
        Player.TouchWall = true
        break
      } else {
        Player.TouchWall = false
      }
    } else if (object === Spikes) {
      if (Player.x + Player.wh/2 > collider[0] - Spikes.width/2 && Player.x - Player.wh/2 < collider[0] + Spikes.width/2 && Player.y + Player.wh/2 > collider[1] - Spikes.height/2 && Player.y - Player.wh/2 < collider[1] + Spikes.height/2) {
        Player.TouchSpikes = true
        break
      } else {
        Player.TouchSpikes = false
      }
    }
    
  }
}

function BulletCollision (object, x, y, index) {
  for (var i=0; i<object.length; i++) {
    var collider = object[i]
    for (var i=0; i<Bullet.length; i++) {
      if (x + 25/2 > collider[0] - collider[2]/2 && x - 25/2 < collider[0] + collider[2]/2 && y + 25/2 > collider[1] - collider[3]/2 && y - 25/2 < collider[1] + collider[3]/2) {
        Bullets.splice(index,1)
      } 
    }
  }
}

var MouseD = Math.sqrt(Mouse.x*Mouse.x+Mouse.y*Mouse.y)
var MouseD2 = Math.sqrt(Mouse.x-Player.x*Mouse.x-Player.x+Mouse.y-Player.y*Mouse.y-Player.y)
function Combat () {
  if (mousedown) {
    if (Tick > Gun.Reload) {
      Shoot()
      Tick = 0
    }
  }
  Tick += 1
  for (i = 0; i < Bullets.length; i++) {
    Bullet = Bullets[i]
    Bullet[0] += Bullet[2]
    Bullet[1] += Bullet[3]
    DrawBullets(Bullet[0], Bullet[1], 25, 25)
    BulletCollision(Ground, Bullet[0], Bullet[1], i)
  }
}

function Shoot () {
  Bullets.push([Player.x,Player.y,Mouse.x/Math.sqrt(Mouse.x*Mouse.x+Mouse.y*Mouse.y)*Gun.Speed,Mouse.y/Math.sqrt(Mouse.x*Mouse.x+Mouse.y*Mouse.y)*Gun.Speed])
}

function DrawBullets (x,y,width,height) {
  ctx.drawImage(BulletImg, x + CenterX - width/2 - Cam.x, y + CenterY - height/2 - Cam.y, width, height)
}
 
function Physics (gravity, speed, jumpHeight) {
  Player.yv += gravity
  if (keyD) {
    Player.xv += speed
  }
  if (keyA) {
    Player.xv -= speed
  }
  Player.xv *= 0.8
  Player.x += Player.xv
  PlayerCollision(Ground)
  if (Player.TouchGround) {
    Player.x -= Player.xv
  }
  PlayerCollision(Wall)
  if (Player.TouchWall) {
    Player.x -= Player.xv
    if (Player.xv > 0 && keyW) {
      Player.xv = -10
      Player.yv = jumpHeight * -0.5
    } else if (Player.xv < 0 && keyW) {
      Player.xv = 10
      Player.yv = jumpHeight * -0.5
    }
  }
  Player.yv *= 1
  Player.y += Player.yv
  PlayerCollision(Ground)
  PlayerCollision(Wall)
  if (Player.TouchGround || Player.TouchWall) {
    Player.y -= Player.yv
    if (!Hangable) {
      if (Player.yv < 0) {
        Player.Jumped = true
        Player.yv = 0
      } else {
        Player.Jumped = false
        Player.yv = 0
      }
    } else {
      Player.yv = 0
      Player.Jumped = false
    }
  }
  if (keyW && !Player.Jumped) {
    Player.yv -= jumpHeight
    Player.Jumped = true
  }
  Cam.x += (Player.x + (Mouse.x/6) - Cam.x)/6
  Cam.y += (Player.y + (Mouse.y/6) - Cam.y)/6
}

function DrawScene () {
    ctx.fillStyle = black
    ctx.fillRect(0, 0, SceneWidth, SceneHeight)
}

var Sprite = new Image()
function DrawPlayer (x, y, width, height, radius) {
  ctx.drawImage(Sprite, x-(width/2), y-(height/2), width, height)
  if (keyD) {
    Sprite.src = CosRight
  } else if (keyA) {
    Sprite.src = CosLeft
  } else if (keyW) {
    Sprite.src = CosUp
  } else {
    Sprite.src = CosIdle
  }
}

function DrawBlock (x, y, width, height, radius, color) {
    ctx.fillStyle = color
    RoundRect(ctx, x-(width/2), y-(height/2), width, height, radius, true, false)
}

var GroundSprite = new Image()
function DrawMap () {
  for (i=0; i<Ground.length; i++) {
    var block = Ground[i]
    ctx.drawImage(GroundSprite, block[0] - block[2]/2 - Cam.x + CenterX, block[1] - block[3]/2 - Cam.y + CenterY, block[2], block[3])
    GroundSprite.src = "Images/Ground.svg"
  }
  for (i=0; i<Wall.length; i++) {
    var block = Wall[i]
    DrawBlock(block[0] - Cam.x + CenterX, block[1] - Cam.y + CenterY, block[2], block[3], 0, gold)
  }
}

function CheckTutorial () {
  if (Player.TouchWall) {
    Progress = 1
  } else if (keyA||keyD||keyS||keyW) {
    Progress = undefined
  }
}

function ShowTutorial() {
  if (Progress !== undefined) {
    subtile.innerHTML = Notes[Progress]
  } else {
    subtile.innerHTML = ""
  }
}

function Setup () {
  //Setups First Frame
  //You Can Not Draw Here
  console.log("Loading Images")
  console.log("Here are some Usable Commands")
  console.log("Player.SetGravity(value) Sets Gravity Strength")
  console.log("Player.SetSpeed(value) Sets Player Movement Speed")
  console.log("Player.SetJumpHeight(value) Sets Player Jump Height")
  console.warn("Note: Positive y Values In Commands Point Upwards")
  console.log("Player.GoTo(x, y) Teleports Player To The Desired Position On The Map")
  Update()
}

function Update () {
  //Updates Each Frame
  Physics(Player.Gravity, Player.Speed, Player.JumpHeight)
  CheckTutorial()
  DrawScene()
  DrawMap()
  DrawPlayer(Player.x - Cam.x + CenterX,Player.y - Cam.y + CenterY,Player.wh,Player.wh,10)
  ShowTutorial()
  Combat()
  window.requestAnimationFrame(Update)
}

function RoundRect (ctx, x, y, width, height, radius, fill, stroke) {
    if (typeof stroke === undefined) {
      stroke = false;
    }
    if (typeof radius === undefined) {
      radius = 5;
    }
    if (typeof radius === 'number') {
      radius = {tl: radius, tr: radius, br: radius, bl: radius};
    } else {
      var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
      for (var side in defaultRadius) {
        radius[side] = radius[side] || defaultRadius[side];
      }
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    if (fill) {
      ctx.fill();
    }
    if (stroke) {
      ctx.stroke();
    }
  }

  window.requestAnimationFrame(Setup)