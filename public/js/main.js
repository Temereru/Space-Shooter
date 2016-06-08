//define variables for future use
let player, asteroid, managedObjects, score, enemy, 
enemyArr, betweenWaves, waveNumber, shotCounter, scene, background;

//initiate the resource loading sequence upon page load, passes the next function in the sequence as callback
asteroidLoader().load(loadPlayer);

//call the finction that set the initial state of the game
initialState();

//a module that allows querying the keyboard state without using the events
let keyboard = new THREEx.KeyboardState();

//set the value for pre-game variables
let loaded = false;
let firstRun = true;
let gameRunning = false;
let intervalList = [];
let wavesPieces = [
  [0,0,0,0,0,3,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,3],
  [0,0,0,0,3,0,0,0,3,0],
  [0,0,0,0,0,0,3,0,0,3],
  [0,0,0,0,0,3,0,0,3,0],
  [0,0,3,0,0,0,0,3,0,0],
  [0,0,0,0,0,3,0,0,3,0],
  [0,3,0,3,0,0,0,0,3,0],
  [0,0,3,0,0,3,0,3,0,3],
  [0,3,0,0,3,0,3,0,3,0],
];//the directions for the waves pieces| 0 is asteroid, 3 is enemy. 1 & 2 are left for future implementations of other types of asteroids

//define the geometry for the background
let planeGeometry = new THREE.PlaneGeometry( 497.5, window.innerHeight - 1);

//create the backgroung music element
let bgMusic = document.createElement('audio');
let bgDuration;

//define a new renderer, set it's size to the browser window width and height, and attach it to the DOM
let renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );

//define a new orthographic camera, and position it at z = 100(orthographic camera has no perspective)
let camera = new THREE.OrthographicCamera( window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 1, 1000 );
camera.position.z = 100;

//sets the initial state of the game
function initialState(){
  //objects in this array will have their manage function called every frame
  managedObjects = [];
  score = 0;
  //this array is used to monitor the amount of enemies for wave and game ending controll
  enemyArr = [];
  betweenWaves = true;
  waveNumber = 0;
  shotCounter = 0;
  //define a new physijs scene, and set it's gravity to 0
  scene = new Physijs.Scene();
  scene.setGravity(new THREE.Vector3( 0, 0, 0 ));
}

//a step in the resource loading sequence, passes the next function in the sequence as callback
function loadPlayer(){
  playerLoader().load(loadShots);
}

//a step in the resource loading sequence, passes the next function in the sequence as callback
function loadShots(){
  shotsLoader().load(loadEnemy);
}

//a step in the resource loading sequence, passes the next function in the sequence as callback
function loadEnemy(){
  enemyLoader().load(loadScene);
}

//a step in the resource loading sequence, passes the next function in the sequence as callback
function loadScene(){
  sceneLoader().load(finishedLoading)
}

//final step in the resource loading sequence
function finishedLoading(){
  //when true, the game start button is enabled
  loaded = true;
  //give the background music element the loaded source
  bgMusic.appendChild(loadedScene.bgMusicSource);
  //create the plane object from the predefined geometry and the loaded material
  background = new THREE.Mesh( planeGeometry, loadedScene.planeMaterial );
  //used to identify the background in collisions
  background.objType = 'background';
  //set the background to z axis -10
  background.position.z = -10;
  //remove the loading text notification from the screen
  $('.loading-text').removeClass('show');
}

//add an object class instance to the managed object list, and add the object to the scene
function addObjects(classObj, obj){
  let managedObj = {
    key: helperMethods.getRand(1000000),
    obj: classObj
  };
  managedObjects.push(managedObj);
  scene.add(obj);
};

//handles the wave spawning
function spawnWave(){
  betweenWaves = false;
  //creates asteroids, amount and type is defined by wavesPieces array, sets a half a second delay between asteroid
  for(let i = 0; i < wavesPieces.length; i++){
    if(i === 0){//first one without a delay, currently always an asteroid
      asteroid = new AsteroidModel();
      addObjects(asteroid, asteroid.asteroidObj);
    }else{
        setTimeout(function(){
          let type = wavesPieces[waveNumber][i];
          if(type === 0){
            asteroid = new AsteroidModel();
            addObjects(asteroid, asteroid.asteroidObj);
          }else if(type === 3){
            enemy = new EnemyModel();
            addObjects(enemy, enemy.enemyObj);
          }

      }, i * 500);
    }
  }
  //deals with the wave number display
  waveNumber++;
  $('.wave').html('Wave ' + waveNumber);
}

//start the game
function start(){
  //removes starting overlay from display
  $('.start-overlay').removeClass('show');
  //while true, the render loop will be enabled
  gameRunning = true;
  //add the background to the scene
  scene.add(background);
  //create a new instance of the player class
  player = new PlayerModel();
  //initiate the load function of the player, passing as callback the addObjects function
  player.load(addObjects);
  //spawn the first wave
  spawnWave();
  //start playing background music
  playBgMusic();
  //start the render loop
  render(); 
}

//restart the game with the initial values
function restart(){
  initialState();
  $('.overlay').removeClass('show');
  start();
}

//handles playing the background music
function playBgMusic(){
  //get the duration of the background music track in milliseconds
  bgDuration = bgMusic.duration * 1000;
  //set the background music element to the start of the track
  bgMusic.currentTime = 0;
  //start playing the track
  bgMusic.play();
  //creates an interval so that the background music will loop
  let bgInterval = setInterval(function(){
    if(gameRunning){
      bgMusic.currentTime = 0;
      bgMusic.play();
    }
  }, bgDuration - 100);
}

//invokes the keyboard managing function, and invokes the manage function of every object in the managed object list
function manageObjects(){
  manageKeyboard();
  for(var i = 0; i < managedObjects.length; i++){
    managedObjects[i].obj.manage(scene, managedObjects, managedObjects[i].key, enemyArr);
  }
}

//the render function, used to create the render loop
function render() {
  //only does stuff if the game is running
  if(gameRunning){
    //if true, the game will end
    if(enemyArr.length === 0 && waveNumber === 10 && !betweenWaves){
      betweenWaves = true;
      endGame(true);
    //if true, the next wave will be spawned in 2 seconds
    }else if(enemyArr.length === 0 && !betweenWaves){
      betweenWaves = true;
      setTimeout(function(){
        spawnWave();
      }, 2000);
    }
    //manage the managed objects and the keyboard
    manageObjects();
    //run the physics simulation
    scene.simulate();
    //render the current state of the scene
    renderer.render( scene, camera );
    //will call the render function every frame, in 60 FPS
    requestAnimationFrame( render );
  }
}

//manage the state of the keyboard
function manageKeyboard(){
  //if spacebar is pressed, create instances of the player shot in a pace of 3 per second
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
  //if both left and right arrows are pressed, set the X axis movement direction of the player to none
  if(keyboard.pressed('left+right')){
    player.direction.left = false;
    player.direction.right = false;
  }else{//else, set the movement diretion based on which one is pressed
    player.direction.left = keyboard.pressed('left');
    player.direction.right = keyboard.pressed('right');
  }
  //if both up and down arrows are pressed, set the Y axis movement direction of the player to none
  if(keyboard.pressed('up+down')){
    player.direction.up = false;
    player.direction.down = false;
  }else{//else, set the movement diretion based on which one is pressed
    player.direction.up = keyboard.pressed('up');
    player.direction.down = keyboard.pressed('down');
  } 
}

//return true only if there is no window open
function focusOnGame(){
  if($('.register-form').hasClass('show') || $('.login-form').hasClass('show') || $('.logout-confirm').hasClass('show') 
    || $('.logout-success').hasClass('show') || $('.submit-score').hasClass('show') || getToken() === undefined){
    return false;
  }else{
    return true;
  }
}

//update the score display
function displayScore(){
  $('.score').html('Score: ' + score);
}

//handle the end of the game, shows data based on lose or win
function endGame(win){
  firstRun = false;
  bgMusic.pause();
  for(let i = 0; i < intervalList.length; i++){
    clearInterval(intervalList[i]);
  }
  if(win){
    gameRunning = false;
    $('.submit-score .title').text('You Win!');
    $('.overlay').addClass('show');
  }else{
    gameRunning = false;
    $('.submit-score .title').html('Game Over!');
  }
  $('.submit-score .score-text').text('Your final score is: ' + score);
  //enables score submit, and shows the submit score window
  enableScoreSubmit = true;
  $('.overlay').addClass('show');
  $('.submit-score').addClass('show');
}

//handle keydown events outside of the game cycle, for start and restart
$(document).on('keydown' , function (e) {
  switch(e.which){
    //if the R key was pressed
    case 82:
      if(!gameRunning && !firstRun && focusOnGame()){
        restart();
      };
      break;
    //if the ENTER key was pressed
    case 13:
      if(!gameRunning && firstRun && loaded && focusOnGame()){
        start();
      }
      break;
  }
});