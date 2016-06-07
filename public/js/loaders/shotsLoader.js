//module for loading all Shots related models, textures and sound files
let shotTextureLoader = new THREE.TextureLoader();

const loadedShots = {};

const shotsLoader = function(){
  this.load = function(callback){
    shotTextureLoader.load('../../assets/textures/fx_lazer_orange_dff.png', function(texture){
      loadedShots.playerShotMaterial = Physijs.createMaterial(new THREE.MeshBasicMaterial( { map: texture, blending: THREE.AdditiveBlending, transparent: true, opacity: 1, color: 0xFFFFFF } ), 0, 0);
      callback();
    });
    loadedShots.playerShotMusicSource = document.createElement('source');
    loadedShots.playerShotMusicSource.src = '../../assets/audio/weapon_player.wav';
  };

  return {
    load: load
  }
}