class EnemyShot{
  constructor(xPos,yPos){
    //create a new enemy shot object using a cylinder geometry and the texture that was loaded
    let shotGeometry = new THREE.CylinderGeometry( 3, 3, 20, 64 );
    this.enemyShotObj = new Physijs.ConvexMesh(shotGeometry, loadedShots.enemyShotMaterial, 1);
    //set the rotation of the shot so that it would face straight ahead(down)
    this.enemyShotObj.rotation.x = helperMethods.convertToRad(180);
    //set the scale of the shot
    this.enemyShotObj.scale.x = 2;
    this.enemyShotObj.scale.y = 2;
    this.enemyShotObj.scale.z = 2;
    //set the inital position to the positions given by the enemy position
    this.enemyShotObj.position.x = xPos;
    this.enemyShotObj.position.y = yPos;
    //the object type is used to identify the shot in collisions
    this.enemyShotObj.objType = "enemyShot";
    //give the shot object the destroyByHit and clean functions
    this.enemyShotObj.destroyByHit = this.destroyByHit;
    this.enemyShotObj.clean = this.clean;
    //set the collision flags so that the shot won't have physical collision effects
    this.enemyShotObj._physijs.collision_flags = 4;
    //if true the shot will be destroyed in the manage function
    this.enemyShotObj.toDestroy = false;
    //add a listener for collision events that involve the shot
    this.enemyShotObj.addEventListener( 'collision', function(other_object, relative_velocity, relative_rotation, contact_normal) {
      if(other_object.objType === 'player'){
        this.toDestroy = true;
        other_object.toDestroy = true;
      }
    });
    //if true, the manage function will set the shot velocity
    this.setVelocity = true;
    //create the audio element that will be used upon shot creation
    this.enemyShotMusic = document.createElement('audio');
    this.enemyShotMusic.appendChild(loadedShots.enemyShotMusicSource);
  }
  //removes references to the shot
  clean(scene, objs, key){
    for(let i = 0; i < objs.length; i++){
      if(objs[i].key === key){
        objs.splice(i, 1);
      }
    }
    scene.remove(this.enemyShotObj || this);
  }
  //called every frame, used to manage shot behaviour
  manage(scene, objs, key){
    //determines wether the shot should be cleaned, and if so, executes the clean function
    if(this.enemyShotObj.toDestroy){
      this.clean(scene, objs, key);
    }
    //sets initial velocity
    if(this.setVelocity){
      this.enemyShotObj.setLinearVelocity(new THREE.Vector3(0, -400, 0));
      this.setVelocity = false;
    }
    //cleans the shot if it didn't hit anything by the time it got out of the map
    if(this.enemyShotObj.position.y > 350){
      this.clean(scene, objs, key);
    }
  }
}