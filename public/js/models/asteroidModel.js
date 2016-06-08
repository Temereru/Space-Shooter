class AsteroidModel {
  constructor(){
    //create a new asteroid from the geometry and material loaded
    this.asteroidObj = new Physijs.ConvexMesh(loadedAsteroids.asteroidGeometry1, loadedAsteroids.asteroidMaterial1, 1);
    //set asteroid scale
    this.asteroidObj.scale.x = 40;
    this.asteroidObj.scale.y = 40;
    this.asteroidObj.scale.z = 40;
    //get a randomized starting position
    let pos = this.getStartPos();
    this.asteroidObj.position.y = pos.y;
    this.asteroidObj.position.x = pos.x;
    //get a randomized starting rotation
    let rot = this.getRot();
    this.asteroidObj.rotation.x = rot.x;
    this.asteroidObj.rotation.y = rot.y;
    this.asteroidObj.rotation.z = rot.z;
    //the object type is used to identify the asteroid in collisions
    this.asteroidObj.objType = "asteroid";
    //set a rndomized key; used for tehe managed object list
    this.asteroidObj.key = helperMethods.getRand(1000000);
    //give the asteroid the destroyByHit function
    this.asteroidObj.destroyByHit = this.destroyByHit;
    //if true the asteroid will be destroyed in the manage function
    this.asteroidObj.toDestroy = false;
    //if true, the destroying function will add points
    this.asteroidObj.hit = false;
    //create and add a child sphere to the asteroid, makes collision detection better
    this.sphere = new Physijs.SphereMesh(new THREE.SphereGeometry(50, 32, 32))
    this.sphere._physijs.collision_flags = 4;
    this.asteroidObj.add(this.sphere);
    //set the collision flags so that the asteroid won't have physical collision effects
    this.asteroidObj._physijs.collision_flags = 4;
    //add the asteroid to the asteroid list, used to detect wave endings and game ending
    asteroids.push(this.asteroidObj.key);
    //if true, the manage function will set the asteroid velocity
    this.setVelocity = true;
    //if true, the manage function will set the asteroid angular velocity
    this.setAngular = true;
    //create the audio element that will be used upon asteroid destruction
    this.asteroidExplosionMusic = document.createElement('audio');
    this.asteroidExplosionMusic.appendChild(loadedAsteroids.asteroidExplosionMusicSource);
  };
  //return randomzed x and y values
  getStartPos(){
    let x = helperMethods.getRand(210, -210);
    let y = helperMethods.getRand(380, 350);
    return {x:x,y:y}
  }
  //return randomized values euler
  getRot(){
    let x = helperMethods.getRand(360);
    let y = helperMethods.getRand(360);
    let z = helperMethods.getRand(360);
    return new THREE.Euler( helperMethods.convertToRad(x),helperMethods.convertToRad(y),helperMethods.convertToRad(z), 'XYZ' );
  }
  //return a randomized velocity.y value
  getVelocity(){
    return helperMethods.getRand(-100, -150);
  }
  //return a Vector3 with random values
  getRandTumble(){
    let x = helperMethods.getRand(3, -3);
    let y = helperMethods.getRand(3, -3);
    let z = helperMethods.getRand(3, -3);
    let vector = new THREE.Vector3(x,y,z);
    return vector;
  }
  //removes references to the asteroid
  clean(scene, objs, key, asteroids){
    for(let i = 0; i < objs.length; i++){
      if(objs[i].key === key){
        objs.splice(i, 1);
      }
    }
    scene.remove(this.asteroidObj);
    let idx = asteroids.indexOf(this.asteroidObj.key);
    
    if(idx !== -1){
      asteroids.splice(idx, 1);
    }
  }
  //called every frame, used to manage asteroid behaviour
  manage(scene, objs, key, asteroids){
    //determines wether the asteroid should be destroyed, and if so, wether points should be added for it
    if(this.asteroidObj.toDestroy && this.asteroidObj.hit){
      this.destroyByHit(scene, objs, key, asteroids);
    }else if(this.asteroidObj.toDestroy){
      this.clean(scene, objs, key, asteroids);
    }
    //sets initial velocity
    if(this.setVelocity){
      this.asteroidObj.setLinearVelocity(new THREE.Vector3(0, this.getVelocity(), 0));
      this.setVelocity = false;
    }
    if(this.setAngular){
      this.asteroidObj.setAngularVelocity(this.getRandTumble());
      this.setAngular = false;
    }
    //cleans the asteroid if it wasn't destroyed by the time it got out of the map
    if(this.asteroidObj.position.y <= -400){
      this.clean(scene, objs, key, asteroids);
    }
  };
  //manages the destruction of the asteroid if it was hit, and set the new score
  destroyByHit(scene, objs, key, asteroids){
    this.clean(scene, objs, key, asteroids);
    this.asteroidExplosionMusic.play();
    score += 10;
    displayScore();
  }
}