let shotTextureLoader = new THREE.TextureLoader();

let playerShotMaterial;

shotTextureLoader.load('../../assets/textures/fx_lazer_orange_dff2.png', function(texture){
  playerShotMaterial = new THREE.MeshBasicMaterial( { map: texture, transparent: true, opacity: 0.7, color: 0xFFFFFF } );
});