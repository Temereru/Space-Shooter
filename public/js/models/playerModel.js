
class PlayerModel{
  constructor(){
    this.playerObj;
  }


  load(callback){
    //create a new player object from the geometry and material loaded
    this.playerObj = new Physijs.ConvexMesh(loadedPlayer.playerGeometry, loadedPlayer.playerMaterial, 10);
    //set the starting rotation so the the player is looking straight ahead(up);
    this.playerObj.rotation.x = helperMethods.convertToRad(90);
    this.playerObj.rotation.y = helperMethods.convertToRad(180);
    //set the player scale
    this.playerObj.scale.x = 40;
    this.playerObj.scale.y = 40;
    this.playerObj.scale.z = 40;
    //set the player initial position
    this.playerObj.position.y = -280;
    //the object type is used to identify the player in collisions
    this.playerObj.objType = 'player';
    //give the player object the destroyByHit and clean functions
    this.playerObj.destroyByHit = this.destroyByHit;
    this.playerObj.clean = this.clean;
    //if true, the player would be destroyed in the manage function, and the game will end
    this.playerObj.toDestroy = false;
    //object used to determine which direction should the player move; used by the manage function
    this.direction = {
      left: false,
      right: false,
      up: false,
      down: false
    }
    //set the values for base speed, drag, and max speed multiplier
    this.speed = 20;
    this.drag = 1.05;
    this.speedMult = 10;
    //add a listener for collision events that involve the player
    this.playerObj.addEventListener( 'collision', function(other_object, relative_velocity, relative_rotation, contact_normal) {
      if(other_object.objType === 'asteroid'){
        this.toDestroy = true;
        other_object.toDestroy = true;
      }
    });
    //create the audio element that will be used upon player destruction
    this.playerDestroyMusic = document.createElement('audio');
    this.playerDestroyMusic.appendChild(loadedPlayer.playerDestroyMusicSource);
    //invokes the callback function that the constructor was passed, giving it the class instance and player object
    callback(this, this.playerObj);
  }
  //removes references to the player
  clean(scene, objs, key){
    for(let i = 0; i < objs.length; i++){
      if(objs[i].key === key){
        objs.splice(i, 1);
      }
    }
    scene.remove(this.playerObj || this);
  }
  //called every frame, used to manage player behaviour
  manage(scene, objs, key){
    //determines wether the player should be destroyed, and if so, executes the destruction
    if(this.playerObj.toDestroy){
      this.destroyByHit(scene, objs, key);
      return;
    }
    //get the current value of the player velocity
    let vel = this.playerObj.getLinearVelocity();
    //if the left key is pressed
    if(this.direction.left){
      //decreasing the velocity.x of the player, up to the minimum defined by the multiplication of the base speed and max multiplier
      vel.x = (vel.x -= this.speed) <= (-this.speedMult * this.speed) ? (-this.speedMult * this.speed) : (vel.x - this.speed);
    }else if(!this.direction.right && vel.x < 0){//if the left and right keys are not pressed, and the player is moving
      //divides the velocity.x by the drag, making the player stop gradually
      vel.x = (vel.x / this.drag) < -0.5 ? (vel.x / this.drag) : 0;
    }
    //if the right key is pressed
    if(this.direction.right){
      //increasing the velocity.x of the player, up to the maximum defined by the multiplication of the base speed and max multiplier
      vel.x = (vel.x += this.speed) >= (this.speedMult * this.speed) ? (this.speedMult * this.speed) : (vel.x + this.speed);
    }else if(!this.direction.left && vel.x > 0){//if the right and left keys are not pressed, and the player is moving
      //divides the velocity.x by the drag, making the player stop gradually
      vel.x = (vel.x / this.drag) > 0.5 ? (vel.x / this.drag) : 0;
    }
    //if the up key is pressed
    if(this.direction.up){
      //increasing the velocity.y of the player, up to the maximum defined by the multiplication of the base speed and max multiplier
      vel.y = (vel.y += this.speed) >= (this.speedMult * this.speed) ? (this.speedMult * this.speed) : (vel.y + this.speed);
    }else if(!this.direction.down && vel.y > 0){//if the up and down keys are not pressed, and the player is moving
      //divides the velocity.y by the drag, making the player stop gradually
      vel.y = (vel.y / this.drag) > 0.5 ? (vel.y / this.drag) : 0;
    }
    //if the down key is pressed
    if(this.direction.down){
      //decreasing the velocity.y of the player, up to the minimum defined by the multiplication of the base speed and max multiplier
      vel.y = (vel.y -= this.speed) <= (-this.speedMult * this.speed) ? (-this.speedMult * this.speed) : (vel.y - this.speed);
    }else if(!this.direction.up && vel.y < 0){//if the down and up keys are not pressed, and the player is moving
      //divides the velocity.y by the drag, making the player stop gradually
      vel.y = (vel.y / this.drag) < -0.5 ? (vel.y / this.drag) : 0;
    }
    //if the player reaches the limit on one of the axes, or both, stop it's movement in the corresponding axis or axes
    if(((this.playerObj.position.y >= 290 && vel.y > 0) || (this.playerObj.position.y <= -290 && vel.y < 0))&&((this.playerObj.position.x <= -210 && vel.x < 0)||(this.playerObj.position.x >= 210 && vel.x > 0))){
      vel.x = 0;
      vel.y = 0;
    }
    else if((this.playerObj.position.y >= 290 && vel.y > 0) || (this.playerObj.position.y <= -290 && vel.y < 0)){
      vel.y = 0;
    }
    else if((this.playerObj.position.x <= -210 && vel.x < 0) || (this.playerObj.position.x >= 210 && vel.x > 0)){
      vel.x = 0;
    }
    //send the new velocity data to the simulation
    this.playerObj.setLinearVelocity(new THREE.Vector3(vel.x, vel.y, vel.z));
    //reset vel to the velocity from the player
    vel = this.playerObj.getLinearVelocity();
    //set the player rotation.z to create a tilt while moving, based on speed, up to a 45 degree turn in each side
    this.playerObj.rotation.z = helperMethods.convertToRad(180 + (vel.x * (45 / (this.speed * this.speedMult))));
  }
  //manages the destruction of the player if it was hit, and ends the game with a loss
  destroyByHit(scene, objs, key){
    this.clean(scene, objs, key);
    this.playerDestroyMusic.play();
    endGame(false);//if false, the game was ended in a loss
  };
}


