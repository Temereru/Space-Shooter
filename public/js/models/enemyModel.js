class EnemyModel {
  constructor(){
    //create a new enemy from the geometry and material loaded
    this.enemyObj = new Physijs.ConvexMesh(loadedEnemy.enemyGeometry, loadedEnemy.enemyMaterial, 1);
    //set enemy scale
    this.enemyObj.scale.x = 40;
    this.enemyObj.scale.y = 40;
    this.enemyObj.scale.z = 40;
    //get a randomized starting position
    let pos = this.getStartPos();
    this.enemyObj.position.y = pos.y;
    this.enemyObj.position.x = pos.x;
    //set the starting rotation of the enemy ship so that it would be directed downwards
    this.enemyObj.rotation.x = helperMethods.convertToRad(90);
    //the object type is used to identify the enemy in collisions
    this.enemyObj.objType = "enemy";
    //set a rndomized key; used for tehe managed object list
    this.enemyObj.key = helperMethods.getRand(1000000);
    //give the enemy the destroyByHit function
    this.enemyObj.destroyByHit = this.destroyByHit;
    //if true the enemy will be destroyed in the manage function
    this.enemyObj.toDestroy = false;
    //if true, the destroying function will add points
    this.enemyObj.hit = false;
    //create and add a child sphere to the enemy, makes collision detection better
    this.sphere = new Physijs.SphereMesh(new THREE.SphereGeometry(50, 32, 32))
    this.sphere._physijs.collision_flags = 4;
    this.enemyObj.add(this.sphere);
    //set the collision flags so that the enemy won't have physical collision effects
    this.enemyObj._physijs.collision_flags = 4;
    //add the enemy to the enemies list, used to detect wave endings and game ending
    enemyArr.push(this.enemyObj.key);
    //create the audio element that will be used upon enemy destruction
    this.enemyExplosionMusic = document.createElement('audio');
    this.enemyExplosionMusic.appendChild(loadedEnemy.enemyExplosionMusicSource);    
    //start firing every 0.5 seconds, start after 2 seconds
    this.shotInterval = setInterval(this.fire, 2000, this);
    //list used to stop intervals at end game
    intervalList.push(this.shotInterval);

    //set a reandom time for the maneuvers
    this.maneuverTime = helperMethods.getRand(1000, 3000);
    //set the interval that triggers the maneuvers
    this.maneuverInterval = setInterval(this.maneuver, this.maneuverTime + 1000, this);
    intervalList.push(this.maneuverInterval);
    //set the initial target of the maneuvers
    this.targetManeuver = this.enemyObj.position.x;
    //set initial maneuver velocity
    this.maneuverVel = 0;
    
  };
  //return randomzed x and y values
  getStartPos(){
    let x = helperMethods.getRand(210, -210);
    let y = helperMethods.getRand(380, 350);
    return {x:x,y:y}
  }
  //return a Vector3 with random values
  getRandTumble(){
    let x = helperMethods.getRand(3, -3);
    let y = helperMethods.getRand(3, -3);
    let z = helperMethods.getRand(3, -3);
    let vector = new THREE.Vector3(x,y,z);
    return vector;
  }
  //removes references to the enemy
  clean(scene, objs, key, enemyArr){
    for(let i = 0; i < objs.length; i++){
      if(objs[i].key === key){
        objs.splice(i, 1);
      }
    }
    scene.remove(this.enemyObj);
    let idx = enemyArr.indexOf(this.enemyObj.key);
    
    if(idx !== -1){
      enemyArr.splice(idx, 1);
    }
    clearInterval(this.shotInterval);
    clearInterval(this.maneuverInterval);
  }
  //called every frame, used to manage enemy behaviour
  manage(scene, objs, key, enemyArr){
    //determines wether the enemy should be destroyed, and if so, wether points should be added for it
    if(this.enemyObj.toDestroy && this.enemyObj.hit){
      this.destroyByHit(scene, objs, key, enemyArr);
    }else if(this.enemyObj.toDestroy){
      this.clean(scene, objs, key, enemyArr);
    }

    //temp variable used to store changes to the linear velocity, before sending them all at once
    let vel = this.enemyObj.getLinearVelocity();

    //if there is movement that needs to happen in the maneuver code
    if(this.targetManeuver > this.enemyObj.position.x){
      vel.x = this.maneuverVel;
    }else if(this.targetManeuver < this.enemyObj.position.x){
      vel.x = -this.maneuverVel;
    }else{
      vel.x = 0;
    }

    //sets initial velocity
    if(vel.y === 0){
      vel.y = -125;
    }

    //send the updated linear velocity
    this.enemyObj.setLinearVelocity(new THREE.Vector3(vel.x, vel.y, vel.z));

    //cleans the enemy if it wasn't destroyed by the time it got out of the map
    if(this.enemyObj.position.y <= -400){
      this.clean(scene, objs, key, enemyArr);
    }
  };
  //manages the destruction of the enemy if it was hit, and set the new score
  destroyByHit(scene, objs, key, enemyArr){
    this.clean(scene, objs, key, enemyArr);
    this.enemyExplosionMusic.play();
    score += 20;
    displayScore();
  };

  fire(that){
    let shotInstance = new EnemyShot(that.enemyObj.position.x, that.enemyObj.position.y - 10);
    addObjects(shotInstance, shotInstance.enemyShotObj);
    shotInstance.enemyShotMusic.play();
  }

  maneuver(that){
    //save the initial position of the enemy
    let tempPosX = that.enemyObj.position.x;
    //get a random distance for the maneuver, always return a value that is directed to the center
    that.targetManeuver = tempPosX + helperMethods.getRand(150, 50) * -Math.sign(that.enemyObj.position.x);
    //calculates the needed velocity to finish the maneuver in time
    that.maneuverVel = tempPosX > that.targetManeuver ? (tempPosX - that.targetManeuver) / (that.maneuverTime / 2000) : (that.targetManeuver - tempPosX) / (that.maneuverTime / 2000);
    //sets the return part of the maneuver
    setTimeout(function(that, tempPosX){
      that.targetManeuver = tempPosX;
      that.maneuverVel = that.enemyObj.position.x > that.targetManeuver ? (that.enemyObj.position.x - that.targetManeuver) / (that.maneuverTime / 2000) : (that.targetManeuver - that.enemyObj.position.x) / (that.maneuverTime / 2000);
      //sets a time between maneuvers
      setTimeout(function(that){
        that.maneuverVel = 0;
      }, (that.maneuverTime/2), that);
    },(that.maneuverTime/2), that, tempPosX);
  }
}