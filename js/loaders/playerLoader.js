var playerJsonLoader = new THREE.JSONLoader();
var playerTextureLoader = new THREE.TextureLoader();

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
  }

  return {
    load: load
  }
}