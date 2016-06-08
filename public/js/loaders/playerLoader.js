//module for loading all player related models and textures
let playerJsonLoader = new THREE.JSONLoader();
let playerTextureLoader = new THREE.TextureLoader();

const loadedPlayer = {};

const playerLoader = function(){
  this.load = function(callback){
    let that = this;
    playerJsonLoader.load('../../assets/models/playerShip.json', function(geometry, material){
      playerTextureLoader.load('../../assets/textures/vehicle_playerShip_orange_dff.png', function(texture){
        loadedPlayer.playerMaterial = Physijs.createMaterial( new THREE.MeshBasicMaterial( { map: texture} ), 0, 0);
        loadedPlayer.playerGeometry = geometry;

        callback();
      });
    });
    loadedPlayer.playerDestroyMusicSource = document.createElement('source');
    loadedPlayer.playerDestroyMusicSource.src = '../../assets/audio/explosion_player.wav';
  }

  return {
    load: load
  }
}