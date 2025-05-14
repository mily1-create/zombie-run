var PLAY = 1;
var END = 0;
var gameState = PLAY;

var zombie, zombie_running, zombie_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacleImages = [];

var gatherImages = [];
var score = 0;
var gathered = 0;

var restart, restartImage;
var gameOver, gameOverImage;

function preload(){
  zombie_running = loadAnimation("zombie1.png", "zombie2.png", "zombie3.png");
  zombie_collided = loadAnimation("zombiecollided.png");

  groundImage = loadImage("ground2.png");
  cloudImage = loadImage("background.png");

  gameOverImage = loadImage("Rip.png");
  restartImage = loadImage("restart.png");

  for (let i = 1; i <= 5; i++) {
    obstacleImages.push(loadImage("obstáculo" + i + ".png"));
  }

  for (let i = 1; i <= 3; i++) {
    gatherImages.push(loadImage("gather" + i + ".png"));
  }
}

function setup() {
  createCanvas(600, 200);

  zombie = createSprite(50, 160, 20, 50);
  zombie.addAnimation("running", zombie_running);
  zombie.addAnimation("collided", zombie_collided);
  zombie.scale = 0.3;

  ground = createSprite(200, 180, 400, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;
  ground.velocityX = -6;

  invisibleGround = createSprite(200, 190, 400, 10);
  invisibleGround.visible = false;

  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  gatherGroup = new Group();

  gameOver = createSprite(300, 80);
  gameOver.addImage(gameOverImage);
  gameOver.scale = 0.4;
  gameOver.visible = false;

  restart = createSprite(300, 150);
  restart.addImage(restartImage);
  restart.scale = 0.5;
  restart.visible = false;
}

function draw() {
  background(255);

  text("Puntos: " + score, 500, 30);
  text("Objetos: " + gathered, 500, 50);

  if (gameState === PLAY) {
    score += Math.round(getFrameRate() / 60);

    if (keyDown("space") && zombie.collide(invisibleGround)) {
      zombie.velocityY = -12;
    }

    zombie.velocityY += 0.8;
    zombie.collide(invisibleGround);

    if (ground.x < 0){
      ground.x = ground.width / 2;
    }

    spawnClouds();
    spawnObstacles();
    spawnGathers();

    if (obstaclesGroup.isTouching(zombie)) {
      gameState = END;
    }

    gatherGroup.overlap(zombie, function(g, z){
      g.remove();
      gathered += 1;
    });

  } else if (gameState === END) {
    ground.velocityX = 0;
    zombie.velocityY = 0;
    zombie.changeAnimation("collided");

    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    gatherGroup.setVelocityXEach(0);

    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    gatherGroup.setLifetimeEach(-1);

    gameOver.visible = true;
    restart.visible = true;

    if (mousePressedOver(restart)) {
      reset();
    }
  }

  drawSprites();
}

function spawnClouds() {
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600, random(40, 80), 40, 10);
    cloud.addImage(cloudImage);
    cloud.scale = 0.1;
    cloud.velocityX = -3;
    cloud.lifetime = 210;
    cloud.depth = zombie.depth;
    zombie.depth += 1;
    cloudsGroup.add(cloud);
  }
}

function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(600 + Math.random() * 100, 165, 10, 40);
    var rand = Math.floor(random(0, obstacleImages.length));
    obstacle.addImage(obstacleImages[rand]);
    obstacle.scale = 0.2;
    obstacle.velocityX = -(6 + score / 150);
    obstacle.lifetime = 110;
    obstaclesGroup.add(obstacle);
  }
}

function spawnGathers() {
  if (frameCount % 150 === 0) {
    var gather = createSprite(600, random(80, 120), 10, 10);
    var rand = Math.floor(random(0, gatherImages.length));
    gather.addImage(gatherImages[rand]);
    gather.scale = 0.15;
    gather.velocityX = -6;
    gather.lifetime = 110;
    gatherGroup.add(gather);
  }
}

function reset() {
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;

  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  gatherGroup.destroyEach();

  zombie.changeAnimation("running");

  score = 0;
  gathered = 0;
}
