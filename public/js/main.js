asteroidLoader().load(loadPlayer);

let managedObjects = [];
let collidableMeshList = [];
let gameRunning = true;
let score = 0;
let asteroids = [];


var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );

var scene = new Physijs.Scene();
scene.setGravity(new THREE.Vector3( 0, -30, 0 ));
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
  playerLoader().load(loadScene);
}

function loadScene(){
  sceneLoader().load(start)
}

function start(){
  
  let planeGeometry = new THREE.PlaneGeometry( 497.5, window.innerHeight - 1);
  let plane = new THREE.Mesh( planeGeometry, loadedScene.planeMaterial );
  plane.position.z = -10;
  scene.add(plane);
  player = new PlayerModel();
  player.load(addObjects);
  for(let i = 0; i < 5; i++){
    testAsteroid = new AsteroidModel();
    addObjects(testAsteroid, testAsteroid.asteroidObj);
  }
  render();
}

function restart(){
  console.log('restart');
  scene = new Physijs.Scene();
  managedObjects = [];
  collidableMeshList = [];
  gameRunning = true;
  score = 0;
  asteroids = [];
  $('.overlay').removeClass('show');
  start();
}

var manageObjects = function(){
  for(var i = 0; i < managedObjects.length; i++){
    managedObjects[i].obj.manage(scene, managedObjects, managedObjects[i].key, asteroids);
  }
}

function render() {
  if(gameRunning){
    if(asteroids.length === 0){
      endGame(true);
    }
    $('.score').html('Score: ' + score);
    manageObjects();
    scene.simulate();
    renderer.render( scene, camera );
    requestAnimationFrame( render );
  }
}

function keyRouter(){
  if(gameRunning){
    for (var i in keys) {
      if (!keys.hasOwnProperty(i)) continue;
      switch(i){
      case '37':
        player.move('left');
        break;
      case '39':
        player.move('right');
        break;
      case '38':
        player.move('up');
        break;
      case '40':
        player.move('down');
        break;
      case '17':
        let shotInstance = new PlayerShot(player.playerObj.position.x, player.playerObj.position.y + 10);
        addObjects(shotInstance, shotInstance.playerShotObj)
        break;
      }
    }
  }
}


var keys = {};
$(document).keydown(function (e) {
    if(e.which === 82 && !gameRunning){
      restart();
    };
    keys[e.which] = true;
    keyRouter();
});

$(document).keyup(function (e) {
    delete keys[e.which];
    
    keyRouter();;
});

function endGame(win){
  if(win){
    gameRunning = false;
    $('.game-text').html('You Win');
    $('.game-text').addClass('win');
    $('.overlay').addClass('show');
  }else{
    gameRunning = false;
    $('.game-text').html('Game Over! You Lose');
    $('.game-text').addClass('lose');
    $('.overlay').addClass('show');
  }
}
