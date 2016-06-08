//module for loading all enemy related models, textures and sound files
let enemyJsonLoader = new THREE.JSONLoader();
let enemyTextureLoader = new THREE.TextureLoader();

const loadedEnemy = {};

const enemyLoader = function(){
  this.load = function(callback){
    let that = this;
    enemyJsonLoader.load('../../assets/models/enemyShip.json', function(geometry, material){
      enemyTextureLoader.load('../../assets/textures/vehicle_enemyShip_purple_dff.png', function(texture){
        loadedEnemy.enemyMaterial = Physijs.createMaterial(new THREE.MeshBasicMaterial( { map: texture} ),0,0);
        loadedEnemy.enemyGeometry = geometry;

        callback();
      });
    });
    loadedEnemy.enemyExplosionMusicSource = document.createElement('source');
    loadedEnemy.enemyExplosionMusicSource.src = '../../assets/audio/explosion_enemy.wav';
  }

  return {
    load: load
  }
}