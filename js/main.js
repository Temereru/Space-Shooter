var textureLoader = new THREE.TextureLoader();
var managedObjects = [];

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );

var scene = new THREE.Scene();
var camera = new THREE.OrthographicCamera( window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 1, 1000 );
camera.position.z = 100;


var planeGeometry = new THREE.PlaneGeometry( window.innerWidth * 0.5, window.innerHeight - 1);
textureLoader.load('../../assets/textures/tile_nebula_green_dff.png', function(texture){
  var planeMaterial = new THREE.MeshBasicMaterial( { map: texture} );
  var plane = new THREE.Mesh( planeGeometry, planeMaterial );
  plane.position.z = -10;
  scene.add( plane );
});

var addObjects = function(classObj, obj){
  managedObjects.push(classObj);
  scene.add(obj);
};

const player = new PlayerModel();
player.load(addObjects);


var manageObjects = function(){
  for(var i = 0; i < managedObjects.length; i++){
    managedObjects[i].manage(scene, managedObjects, i);
  }
}

function render() {
  manageObjects();
  requestAnimationFrame( render );
  renderer.render( scene, camera );
}
render();

function keyRouter(){
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


var keys = {};
$(document).keydown(function (e) {
    keys[e.which] = true;
    console.log(e.which);
    keyRouter();
});

$(document).keyup(function (e) {
    delete keys[e.which];
    
    keyRouter();;
});

