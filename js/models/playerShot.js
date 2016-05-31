var jsonLoader = new THREE.JSONLoader();
var textureLoader = new THREE.TextureLoader();

class PlayerShot{
  constructor(xPos,yPos){
    let shotGeometry = new THREE.CylinderGeometry( 3, 3, 20, 64 );
    this.playerShotObj = new THREE.Mesh(shotGeometry, playerShotMaterial);
    this.playerShotObj.rotation.x = helperMethods.convertToRad(180)
    this.playerShotObj.scale.x = 2;
    this.playerShotObj.scale.y = 2;
    this.playerShotObj.scale.z = 2;
    this.playerShotObj.position.x = xPos;
    this.playerShotObj.position.y = yPos;
  }

  clean(scene, objs, i){
    objs.splice(i, 1);
    scene.remove(this.playerShotObj);
  }

  manage(scene, objs, i){
    this.playerShotObj.position.y += 8;
    if(this.playerShotObj.position.y > 350){
      this.clean(scene, objs, i);
    }
  }
}