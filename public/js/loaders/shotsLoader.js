let shotTextureLoader = new THREE.TextureLoader();

const loadedShots = {};

const shotsLoader = function(){
  this.load = function(callback){
    shotTextureLoader.load('../../assets/textures/fx_lazer_orange_dff2.png', function(texture){
      loadedShots.playerShotMaterial = Physijs.createMaterial(new THREE.MeshBasicMaterial( { map: texture, transparent: true, opacity: 0.7, color: 0xFFFFFF } ), 0, 0);
      callback();
    });
    loadedShots.playerShotMusicSource = document.createElement('source');
    loadedShots.playerShotMusicSource.src = '../../assets/audio/weapon_player.wav';
  };

  return {
    load: load
  }
}