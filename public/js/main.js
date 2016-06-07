asteroidLoader().load(loadPlayer);

let keyboard = new THREEx.KeyboardState();

let loaded = false;
let managedObjects = [];
let gameRunning = false;
let score = 0;
let asteroids = [];
let betweenWaves = true;
let waveNumber = 0;
let firstRun = true;
let shotCounter = 0;

let bgMusic = document.createElement('audio');
let bgDuration;


var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );

var scene = new Physijs.Scene();
scene.setGravity(new THREE.Vector3( 0, 0, 0 ));
var camera = new THREE.OrthographicCamera( window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 1, 1000 );
camera.position.z = 100;

var addObjects = function(classObj, obj){
  let managedObj = {
    key: helperMethods.getRand(1000000),
    obj: classObj
  };
  managedObjects.push(managedObj);
  scene.add(obj);
};

let player;
let testAsteroid;

function loadPlayer(){
  playerLoader().load(loadShots);
}

function loadShots(){
  shotsLoader().load(loadScene);
}

function loadScene(){
  sceneLoader().load(finishedLoading)
}

function finishedLoading(){
  loaded = true;
  bgMusic.appendChild(loadedScene.bgMusicSource);
  $('.loading-text').removeClass('show');
}

function spawnWave(){
  betweenWaves = false;
  //for(let i = 0; i < 10; i++){
  let spawner = setInterval(function(){
      testAsteroid = new AsteroidModel();
      addObjects(testAsteroid, testAsteroid.asteroidObj);
    }, 500);
  //}
  setTimeout(function(){
    clearInterval(spawner);
  }, 5000)
  waveNumber++;
  $('.wave').html('Wave ' + waveNumber)
}

function start(){
  $('.start-overlay').removeClass('show');
  gameRunning = true;
  let planeGeometry = new THREE.PlaneGeometry( 497.5, window.innerHeight - 1);
  let plane = new THREE.Mesh( planeGeometry, loadedScene.planeMaterial );
  plane.objType = 'background';
  plane.position.z = -10;
  scene.add(plane);
  player = new PlayerModel();
  player.load(addObjects);
  spawnWave();
  render();
  bgDuration = bgMusic.duration * 1000;
  bgMusic.currentTime = 0;
  bgMusic.play();
  let bgInterval = setInterval(function(){
    if(gameRunning){
      bgMusic.currentTime = 0;
      bgMusic.play();
    }
  }, bgDuration - 100);
}

function restart(){
  scene = new Physijs.Scene();
  managedObjects = [];
  score = 0;
  asteroids = [];
  betweenWaves = false;
  waveNumber = 0;
  shotCounter = 0;
  $('.overlay').removeClass('show');
  start();
}

var manageObjects = function(){
  manageKeyboard();
  for(var i = 0; i < managedObjects.length; i++){
    managedObjects[i].obj.manage(scene, managedObjects, managedObjects[i].key, asteroids);
  }
}

function render() {
  if(gameRunning){
    if(asteroids.length === 0 && waveNumber === 10 && !betweenWaves){
      betweenWaves = true;
      setTimeout(function(){
        if(asteroids.length === 0){
          endGame(true);
        }else{
          betweenWaves = false;
        }
      }, 501);
    }else if(asteroids.length === 0 && !betweenWaves){
      betweenWaves = true;
      setTimeout(function(){
        if(asteroids.length === 0){
          setTimeout(function(){
            spawnWave();
          }, 1499);
        }else{
          betweenWaves = false;
        }
      }, 501)
    }
    $('.score').html('Score: ' + score);
    manageObjects();
    scene.simulate();
    renderer.render( scene, camera );
    requestAnimationFrame( render );
  }
}

function manageKeyboard(){
  if(keyboard.pressed('space')){
    if(shotCounter % 20 === 0 || shotCounter === 0){
      let shotInstance = new PlayerShot(player.playerObj.position.x, player.playerObj.position.y + 10);
      addObjects(shotInstance, shotInstance.playerShotObj);
      shotInstance.playerShotMusic.play();
    }
    shotCounter++;
  }else{
    shotCounter = 0;
  }
  if(keyboard.pressed('left+right')){
    player.direction.left = false;
    player.direction.right = false;
  }else{
    player.direction.left = keyboard.pressed('left');
    player.direction.right = keyboard.pressed('right');
  }
  if(keyboard.pressed('up+down')){
    player.direction.up = false;
    player.direction.down = false;
  }else{
    player.direction.up = keyboard.pressed('up');
    player.direction.down = keyboard.pressed('down');
  } 
}

function focusOnGame(){
  if($('.register-form').hasClass('show') || $('.login-form').hasClass('show') || $('.logout-confirm').hasClass('show') 
    || $('.logout-success').hasClass('show') || $('.submit-score').hasClass('show') || getToken() === undefined){
    return false;
  }else{
    return true;
  }
}

$(document).on('keydown' , function (e) {
  switch(e.which){
    case 82:
      if(!gameRunning && !firstRun && focusOnGame()){
        restart();
      };
      break;
    case 13:
      if(!gameRunning && firstRun && loaded && focusOnGame()){
        start();
      }
      break;
  }
});

function endGame(win){
  firstRun = false;
  bgMusic.pause();
  if(win){
    gameRunning = false;
    $('.submit-score .title').text('You Win!');
    $('.overlay').addClass('show');
  }else{
    gameRunning = false;
    $('.submit-score .title').html('Game Over!');
  }
  $('.submit-score .score-text').text('Your final score is: ' + score);
  enableScoreSubmit = true;
  $('.overlay').addClass('show');
  $('.submit-score').addClass('show');
}
