var jsonLoader = new THREE.JSONLoader();
var textureLoader = new THREE.TextureLoader();

class PlayerShot{
  constructor(){
    this.playerShotObj;
  }

  load(callback){
    let that = this;
    textureLoader.load('../../assets/textures/fx_lazer_orange_dff2.png', function(texture){
        var playerShotMaterial = new THREE.MeshBasicMaterial( { map: texture, transparent: true, opacity: 0.7, color: 0xFFFFFF } );
        var shotGeometry = new THREE.CylinderGeometry( 3, 3, 20, 64 );
        that.playerShotObj = new THREE.Mesh(shotGeometry, playerShotMaterial);
        that.playerShotObj.rotation.x = helperMethods.convertToRad(180)
        that.playerShotObj.scale.x = 2;
        that.playerShotObj.scale.y = 2;
        that.playerShotObj.scale.z = 2;
        callback(that, that.playerShotObj);
      });
  }

  manage(){
    this.playerShotObj.position.y += 4;
  }
}