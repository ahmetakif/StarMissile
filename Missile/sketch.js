let shippic;
let missilepic;
let ship;
let missiles = [];

var score = 0;

var missilegenvar;
var gameover = 0;
var exploded = 0;
var expcircleD = 0;
var expcircleDmax = 100;

//Background
var stars = [];
var speed;

//Ship position
var shipX = 0;
var shipY = 0;

function preload() {
  shippic = loadImage("IMAGES/ship.png");
  missilepic = loadImage("IMAGES/missile.png");
}

function setup(){
  startgame();
  //Background
  for (var i = 0; i < 200; i++) {
    stars[i] = new Star();
  }
}

function draw() {
  drawbackground();
  push();
  translate(shipX - width / 2, shipY - height / 2);
  stroke(255);
  strokeWeight(1);
  fill(0,255,0);
  textSize(30);
  text("StarMissile", 20, height/20);
  if (score < 10 && gameover == 0) {
    noStroke(255);
    fill(255);
    textSize(15);
    text("Tap the sides or use A and D keys", 20, height/10);
  }
  noStroke(255);
  fill(255);
  textSize(25);
  text("Score: " + score, width*0.7, height/20);
  if (gameover == 1){
    stroke(255);
    strokeWeight(4);
    fill(0,255,0);
    textSize(50);
    text("GAME OVER", 20, height / 2);
    noStroke(255);
    fill(255);
    textSize(50);
    text("Score: " + score, 20, height / 2 + 60);
  }
  pop();
  ship.move();
  if (keyIsDown(65)) { // A key
    ship.turn(-5); // Turning angle in every interval
  }
  if (keyIsDown(68)) { // D key
    ship.turn(5);
  }
  else {
    ship.turn(0);
  }
  if (mouseIsPressed == 1) {
    if (mouseX < width / 2){
      ship.turn(-5);
    }
    else {
      ship.turn(5);
    }
  }
  ship.attract();
  ship.explodecheck();
  ship.getpos();
}

function startgame() {
  score = 0;
  gameover = 0;
  exploded = 0;
  expcircleD = 0;
  createCanvas(windowWidth*0.95, windowHeight*0.97);
  var x = width / 2;
  var y = height - 150;
  var d = 70;
  ship = new Ship(x, y, d);
  missilegenvar = setInterval(missilegen, 1000);
}

class Ship {
  constructor(x, y, d){
    this.position = createVector(x-d,y-d);
    this.d = d;
    this.velocityX = 0;
    this.velocityY = -5;
    this.speed = createVector(this.velocityX ,this.velocityY);
    imageMode(CENTER);
    this.angle = 0;
  }
  move() {
    this.position.add(this.speed);
    // if (this.position.x < 0) {
    //   this.position.x = this.position.x + 50;
    // }
    // if (this.position.x > width) {
    //   this.position.x = this.position.x - 50;
    // }
    // if (this.position.y < 0) {
    //   this.position.y = this.position.y + 50;
    // }
    // if (this.position.y > height) {
    //   this.position.y = this.position.y - 50;
    // }
  }
  turn(a) {
    var radian = PI*a/180;
    this.speed = this.speed.rotate(radian);
    this.angle = this.angle + radian;
    imageMode(CENTER);
    push();
    translate(this.position.x,this.position.y);
    rotate(this.angle);
    image(shippic, 0, 0, this.d, this.d*1.2);
    pop();
  }
  attract(){
    for (let m of missiles) {
      m.follow(this.position);
      if (m.intersect(this)) {
        gameover = 1;
        gameOver();
      }
    }
  }
  explodecheck() {
    if (exploded == 1) {
      explode(this.position);
    }
  }
  getpos(){
    shipX = this.position.x;
    shipY = this.position.y;
  }
}

function gameOver(){
  exploded = 1;
  clearInterval(missilegenvar);
  missiles = [];
  gamerestart = setTimeout(startgame, 10000);
}

function missilegen() {
  score++;
  push();
  translate(shipX - width / 2, shipY - height / 2);
  let d = 30;
  let x = random(0, width - d);
  let y = random(0, width - d);
  let a = new missile(x, y, d);
  pop();
  if(missiles.length < 10){
    missiles.push(a);
  }
  for(var i = 0; i < missiles.length; i++){
    var dtoship = dist(missiles[i].position.x, missiles[i].position.y, shipX, shipY);
    if (dtoship > 1000){
      missiles.splice(i, 1);
    }
  }
  for (var m = 0; m < missiles.length; m++){
    for (var n = 0; n < missiles.length; n++){
      if (missiles[n].intersectm(missiles[m]) && m != n){

        missiles.splice(m, 1);
        missiles.splice(n, 1);
      }
    }
  }
}

class missile {
  constructor(x,y,d){
    this.position = createVector(x-d,y-d);
    this.d = d;
    this.velocityX = 0;
    this.velocityY = -5;
    this.speed = createVector(this.velocityX ,this.velocityY);
    imageMode(CENTER);
    this.angle = 0;
    this.history = [];
  }
  move() {
    this.position.add(this.speed);
    var v = createVector(this.position.x, this.position.y);
    this.history.push(v);
    for(var i = 0; i < this.history.length; i++){
      var pos = this.history[i];
      stroke(0, 255, 50, 200);
      strokeWeight(3);
      point(pos.x, pos.y);
    }
    if (this.history.length > 70){
      this.history.splice(0, 1);
    }
  }
  turn(a) {
    var radian = PI*a/180;
    this.speed = this.speed.rotate(radian);
    this.angle = this.angle + radian;
    imageMode(CENTER);
    ellipseMode(CORNER);
    push();
    translate(this.position.x,this.position.y);
    rotate(this.angle);
    fill(0,255,0,50);
    noStroke();
    ellipse(-this.d/1.4,-this.d*1.2/1.4,this.d*1.4, this.d*1.2*1.4);
    fill(0,255,0,100);
    noStroke();
    ellipse(-this.d/2,-this.d*1.2/2,this.d, this.d*1.2);
    image(missilepic, 0, 0, this.d, this.d*1.2);
    pop();
  }
  follow(shippos) {
    let desired = p5.Vector.sub(shippos,this.position);
    let angleBetween = desired.angleBetween(this.speed);
    this.turn(angleBetween);
    this.move();
  }
  intersect(other) {
    let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
    return (d < (this.d + other.d) / 3);
  }
  intersectm(other) {
    let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
    return (d < (this.d + other.d) / 2);
  }
}

function explode(position) {
  exploded = 1;
  var expX = position.x;
  var expY = position.y;
  var expD = 100;
  var endX_1 = random(expX-expD,expX+expD);
  var endY_1 = random(expY-expD,expY+expD);
  var endX_2 = random(expX-expD,expX+expD);
  var endY_2 = random(expY-expD,expY+expD);
  stroke(255);
  strokeWeight(4);
  line(expX,expY,endX_1,endY_1);
  line(expX,expY,endX_2,endY_2);
  expcircleD = expcircleD + 10;
  stroke(255);
  strokeWeight(4);
  noFill();
  for(var i = 0; i < 10; i++){
    if(expcircleD-i*50 > 0){
      ellipseMode(CENTER);
      ellipse(expX,expY,expcircleD-i*40,expcircleD-i*40);
    }
  }
}

function drawbackground() {
  translate(-shipX + width / 2, -shipY + height / 2);
  speed = map(mouseX, 0, width, 0, 50)*0.2;
  background(0);
  push();
  translate(width / 2, height / 2);
  for (var i = 0; i < stars.length; i++) {
    stars[i].update();
    stars[i].show();
  }
  pop();
}

function onDeviceReady() {
    document.removeEventListener('deviceready', onDeviceReady, false);

    // Set AdMobAds options:
    admob.setOptions({
        publisherId:          "ca-app-pub-3940256099942544/6300978111",  // Required
        interstitialAdId:     "ca-app-pub-XXXXXXXXXXXXXXXX/IIIIIIIIII",  // Optional
        tappxIdiOS:           "/XXXXXXXXX/Pub-XXXX-iOS-IIII",            // Optional
        tappxIdAndroid:       "/XXXXXXXXX/Pub-XXXX-Android-AAAA",        // Optional
        tappxShare:           0.5                                        // Optional
    });

    admob.createBannerView();
}

document.addEventListener("deviceready", onDeviceReady, false);

