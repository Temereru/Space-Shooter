var asteroidJsonLoader = new THREE.JSONLoader();
var asteroidTextureLoader = new THREE.TextureLoader();

const loadedAsteroids = {};

const asteroidLoader = function(){
  this.load = function(callback){
    let that = this;
    asteroidJsonLoader.load('../../assets/models/prop_asterois_01.json', function(geometry, material){
      asteroidTextureLoader.load('../../assets/textures/prop_asteroid_01_dff.png', function(texture){
        loadedAsteroids.asteroidMaterial1 = Physijs.createMaterial(new THREE.MeshBasicMaterial( { map: texture} ),0,0);
        loadedAsteroids.asteroidGeometry1 = geometry;

        callback();
      });
    });
    loadedAsteroids.asteroidExplosionMusicSource = document.createElement('source');
    loadedAsteroids.asteroidExplosionMusicSource.src = '../../assets/audio/explosion_asteroid.wav';
  }

  return {
    load: load
  }
}



