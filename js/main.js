var textureLoader = new THREE.TextureLoader();

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

playerModel.load(function(obj){
  scene.add(obj);
})

function render() {
  requestAnimationFrame( render );
  renderer.render( scene, camera );
}
render();

// $(document).on('keydown', function(e){
//   console.log(e.keyCode);
//   switch(e.keyCode){
//     case 37:
//       playerModel.move('left');
//       break;
//     case 38:
//       playerModel.move('up');
//       break;
//     case 39:
//       playerModel.move('right');
//       break;
//     case 40:
//       playerModel.move('down');
//       break;
//     // case 37&&38:
//     //   playerModel.move('left up');
//     //   break
//   }
// })

var keys = {};
$(document).keydown(function (e) {
    keys[e.which] = true;
    
    playerModel.move(keys);
});

$(document).keyup(function (e) {
    delete keys[e.which];
    
    playerModel.move(keys);
});

