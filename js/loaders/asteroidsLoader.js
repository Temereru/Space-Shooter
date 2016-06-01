var asteroidJsonLoader = new THREE.JSONLoader();
var asteroidTextureLoader = new THREE.TextureLoader();

const loadedAsteroids = {};

const asteroidLoader = function(){
  this.load = function(callback){
    let that = this;
    asteroidJsonLoader.load('../../assets/models/prop_asterois_01.json', function(geometry, material){
      asteroidTextureLoader.load('../../assets/textures/prop_asteroid_01_dff.png', function(texture){
        loadedAsteroids.asteroidMaterial1 = new THREE.MeshBasicMaterial( { map: texture} );
        loadedAsteroids.asteroidGeometry1 = geometry;

        callback();
      });
    });
  }

  return {
    load: load
  }
}



