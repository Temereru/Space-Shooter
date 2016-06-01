var sceneTextureLoader = new THREE.TextureLoader();

const loadedScene = {};

const sceneLoader = function(){
  this.load = function(callback){
    let that = this;
    sceneTextureLoader.load('../../assets/textures/tile_nebula_green_dff.png', function(texture){
      loadedScene.planeMaterial = new THREE.MeshBasicMaterial( { map: texture} );
      callback();
    });
  }

  return {
    load: load
  }
}