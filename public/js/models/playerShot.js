
class PlayerShot{
  constructor(xPos,yPos){
    //create a new player shot object using a cylinder geometry and the texture that was loaded
    let shotGeometry = new THREE.CylinderGeometry( 3, 3, 20, 64 );
    this.playerShotObj = new Physijs.ConvexMesh(shotGeometry, loadedShots.playerShotMaterial, 1);
    //set the rotation of the shot so that it would face straight ahead(up)
    this.playerShotObj.rotation.x = helperMethods.convertToRad(180);
    //set the scale of the shot
    this.playerShotObj.scale.x = 2;
    this.playerShotObj.scale.y = 2;
    this.playerShotObj.scale.z = 2;
    //set the inital position to the positions given by the player position
    this.playerShotObj.position.x = xPos;
    this.playerShotObj.position.y = yPos;
    //the object type is used to identify the shot in collisions
    this.playerShotObj.objType = "playerShot";
    //give the shot object the destroyByHit and clean functions
    this.playerShotObj.destroyByHit = this.destroyByHit;
    this.playerShotObj.clean = this.clean;
    //set the collision flags so that the shot won't have physical collision effects
    this.playerShotObj._physijs.collision_flags = 4;
    //if true the shot will be destroyed in the manage function
    this.playerShotObj.toDestroy = false;
    //add a listener for collision events that involve the shot
    this.playerShotObj.addEventListener( 'collision', function(other_object, relative_velocity, relative_rotation, contact_normal) {
      if(other_object.objType === 'asteroid' || other_object.objType === 'enemy'){
        this.toDestroy = true;
        other_object.toDestroy = true;
        other_object.hit = true;
      }
    });
    //if true, the manage function will set the shot velocity
    this.setVelocity = true;
    //create the audio element that will be used upon shot creation
    this.playerShotMusic = document.createElement('audio');
    this.playerShotMusic.appendChild(loadedShots.playerShotMusicSource);
  }
  //removes references to the shot
  clean(scene, objs, key){
    for(let i = 0; i < objs.length; i++){
      if(objs[i].key === key){
        objs.splice(i, 1);
      }
    }
    scene.remove(this.playerShotObj || this);
  }
  //called every frame, used to manage shot behaviour
  manage(scene, objs, key){
    //determines wether the shot should be cleaned, and if so, executes the clean function
    if(this.playerShotObj.toDestroy){
      this.clean(scene, objs, key);
    }
    //sets initial velocity
    if(this.setVelocity){
      this.playerShotObj.setLinearVelocity(new THREE.Vector3(0, 600, 0));
      this.setVelocity = false;
    }
    //cleans the shot if it didn't hit anything by the time it got out of the map
    if(this.playerShotObj.position.y > 350){
      this.clean(scene, objs, key);
    }
  }
}