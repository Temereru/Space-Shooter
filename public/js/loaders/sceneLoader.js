var sceneTextureLoader = new THREE.TextureLoader();

const loadedScene = {};

const sceneLoader = function(){
  this.load = function(callback){
    sceneTextureLoader.load('../../assets/textures/tile_nebula_green_dff.png', function(texture){
      loadedScene.planeMaterial = new THREE.MeshBasicMaterial( { map: texture} );
      callback();
    });
    loadedScene.bgMusicSource = document.createElement('source');
    loadedScene.bgMusicSource.src = '../../assets/audio/music_background.wav';
  }

  return {
    load: load
  }
}