var PLAY = 1;
var END = 0;
var gameState = PLAY;
var gameOver, restart,gameoverimg,restartimg
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var diesound,checkpointsound,jumpsound
var score;


function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  gameoverimg = loadImage("gameOver.png");
  restartimg = loadImage("restart.png");
  

// load sounds

jumpsound=loadSound("jump.mp3")
diesound=loadSound("die.mp3")
checkpointsound=loadSound("checkpoint.mp3")

  
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided)
  trex.scale = 0.5;


  gameOver = createSprite(width/2, height/2)
  gameOver.addImage(gameoverimg)
  gameOver.visible = false

  restart = createSprite(width/2, height/2+50)
  restart.scale = 0.50
  restart.addImage(restartimg)
  restart.visible = false

  
  ground = createSprite(width/2,height-40,width,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  
  invisibleGround = createSprite(width/2,height-25,width,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  console.log("Hello" + 5);
  
  trex.setCollider("circle",0,0,40);
  trex.debug = false
  
  score = 0
}

function draw() {
  background("darkblue");
  //displaying score
  // text("text",x,y)
  // text("Score: "+ score, width-80, 20);
  
  console.log("this is ",gameState)
  
  
  if(gameState === PLAY){
    trex.changeAnimation("running", trex_running);
    text("Score: "+ score, width-80, 20);
    //move the ground
    ground.velocityX = -4;
    //scoring
    score = score + Math.round(frameCount/60);
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >=height-50) {
        trex.velocityY = -13;
        jumpsound.play()
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
      trex.changeAnimation("collided")
      diesound.play()
        gameState = END;

        
    }
  }
   else if (gameState === END) {
      ground.velocityX = 0;
      textSize(30)
      fill("white")

      text("Score: "+ score, width/2-75, height/2+150);
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
     restart.visible = true
     gameOver.visible = true
     
     

    //  set lifetime of each sprite the obstacle and cloud group to -1

obstaclesGroup.setLifetimeEach(-1)
cloudsGroup.setLifetimeEach(-1)


   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  if(mousePressedOver(restart)){
    reset()
  }
  
  drawSprites();
}



function reset(){
  gameState = PLAY
  score = 0
  restartimg.visible = false
  gameOver.visible = false
  obstaclesGroup.visible = false
  obstaclesGroup.destroyEach()
  cloudsGroup.destroyEach()
  restart.visible = false

  
  
}



function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(width,height-40,width,20);
   obstacle.velocityX = -6;
   
    //generate random obstacles        
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
   if (frameCount % 60 === 0) {
     cloud = createSprite(width,height/2);
    cloud.y = Math.round(random(height/1.5,height/2-height/8));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime =(width/3);
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
    }
}
