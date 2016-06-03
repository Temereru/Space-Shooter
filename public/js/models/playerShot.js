
class PlayerShot{
  constructor(xPos,yPos){
    let shotGeometry = new THREE.CylinderGeometry( 3, 3, 20, 64 );
    this.playerShotObj = new Physijs.ConvexMesh(shotGeometry, playerShotMaterial);
    this.playerShotObj.rotation.x = helperMethods.convertToRad(180)
    this.playerShotObj.scale.x = 2;
    this.playerShotObj.scale.y = 2;
    this.playerShotObj.scale.z = 2;
    this.playerShotObj.position.x = xPos;
    this.playerShotObj.position.y = yPos;
    this.playerShotObj.objType = "playerShot";
    this.playerShotObj.destroyByHit = this.destroyByHit;
    this.playerShotObj.clean = this.clean;
    collidableMeshList.push(this.playerShotObj);
  }

  clean(scene, objs, key){
    for(let i = 0; i < objs.length; i++){
      if(objs[i].key === key){
        objs.splice(i, 1);
      }
    }
    scene.remove(this.playerShotObj || this);
  }

  manage(scene, objs, key){
    this.playerShotObj.position.y += 8;
    this.playerShotObj.__dirtyPosition = true;
    if(this.playerShotObj.position.y > 350){
      this.clean(scene, objs, key);
    }
  }

  destroyByHit(scene, objs, key){
    this.clean(scene, objs, key);
    for(let i = 0; i < collidableMeshList.length; i++){
      if(collidableMeshList[i].uuid === this.uuid){
        collidableMeshList.splice(i, 1);
      }
    }
  }
}