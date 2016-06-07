
class PlayerModel{
  constructor(){
    this.playerObj;
  }


  load(callback){
    this.playerObj = new Physijs.ConvexMesh(loadedPlayer.playerGeometry, loadedPlayer.playerMaterial, 10);
    this.playerObj.rotation.x = helperMethods.convertToRad(90);
    this.playerObj.rotation.y = helperMethods.convertToRad(180);
    this.playerObj.scale.x = 40;
    this.playerObj.scale.y = 40;
    this.playerObj.scale.z = 40;
    // playerObj.rotation.z = 5;
    this.playerObj.position.y = -280;
    // this.playerObj._physijs.linearVelocity = {
    //   x:0,
    //   y:0,
    //   z:0
    // };
    this.playerObj.objType = 'player';
    this.playerObj.destroyByHit = this.destroyByHit;
    this.playerObj.clean = this.clean;
    this.speed = 20;
    this.playerObj.toDestroy = false;
    this.direction = {
      left: false,
      right: false,
      up: false,
      down: false
    }
    this.drag = 1.05;
    this.playerObj.addEventListener( 'collision', function(other_object, relative_velocity, relative_rotation, contact_normal) {
    if(other_object.objType == 'asteroid'){
      this.toDestroy = true;
      other_object.toDestroy = true;
    }
      // `this` has collided with `other_object` with an impact this.speed of `relative_velocity` and a rotational force of `relative_rotation` and at normal `contact_normal`
    });
    console.log(this.playerObj);
    callback(this, this.playerObj);
  }

  clean(scene, objs, key){
    for(let i = 0; i < objs.length; i++){
      if(objs[i].key === key){
        objs.splice(i, 1);
      }
    }
    scene.remove(this.playerObj || this);
  }

  manage(scene, objs, key){
    if(this.playerObj.toDestroy){
      this.destroyByHit(scene, objs, key);
      return;
    }
    let vel = this.playerObj.getLinearVelocity();
    if(this.direction.left){
      vel.x = (vel.x -= this.speed) <= (-5 * this.speed) ? (-5 * this.speed) : (vel.x - this.speed);
      this.playerObj.setLinearVelocity(new THREE.Vector3(vel.x, vel.y, vel.z));
    }else if(!this.direction.right && vel.x < 0){
      let delta = (vel.x / this.drag) < -5 ? (vel.x / this.drag) : 0;
      this.playerObj.setLinearVelocity(new THREE.Vector3(delta, vel.y, vel.z));
    }

    vel = this.playerObj.getLinearVelocity();
    if(this.direction.right){
      vel.x = (vel.x += this.speed) >= (5 * this.speed) ? (5 * this.speed) : (vel.x + this.speed);
      this.playerObj.setLinearVelocity(new THREE.Vector3(vel.x, vel.y, vel.z));
    }else if(!this.direction.left && vel.x > 0){
      let delta = (vel.x / this.drag) > 5 ? (vel.x / this.drag) : 0;
      this.playerObj.setLinearVelocity(new THREE.Vector3(delta, vel.y, vel.z));
    }

    vel = this.playerObj.getLinearVelocity();
    if(this.direction.up){
      vel.y = (vel.y += this.speed) >= (5 * this.speed) ? (5 * this.speed) : (vel.y + this.speed);
      this.playerObj.setLinearVelocity(new THREE.Vector3(vel.x, vel.y, vel.z));
    }else if(!this.direction.down && vel.y > 0){
      let delta = (vel.y / this.drag) > 5 ? (vel.y / this.drag) : 0;
      this.playerObj.setLinearVelocity(new THREE.Vector3(vel.x, delta, vel.z));
    }

    vel = this.playerObj.getLinearVelocity();
    if(this.direction.down){
      vel.y = (vel.y -= this.speed) <= (-5 * this.speed) ? (-5 * this.speed) : (vel.y - this.speed);
      this.playerObj.setLinearVelocity(new THREE.Vector3(vel.x, vel.y, vel.z));
    }else if(!this.direction.up && vel.y < 0){
      let delta = (vel.y / this.drag) < -5 ? (vel.y / this.drag) : 0;
      this.playerObj.setLinearVelocity(new THREE.Vector3(vel.x, delta, vel.z));
    }

    
    vel = this.playerObj.getLinearVelocity();
    if(((this.playerObj.position.y >= 290 && vel.y > 0) || (this.playerObj.position.y <= -290 && vel.y < 0))&&((this.playerObj.position.x <= -210 && vel.x < 0)||(this.playerObj.position.x >= 210 && vel.x > 0))){
      this.playerObj.setLinearVelocity(new THREE.Vector3(0, 0, vel.z));
    }
    else if((this.playerObj.position.y >= 290 && vel.y > 0) || (this.playerObj.position.y <= -290 && vel.y < 0)){
      this.playerObj.setLinearVelocity(new THREE.Vector3(vel.x, 0, vel.z));
    }
    else if((this.playerObj.position.x <= -210 && vel.x < 0) || (this.playerObj.position.x >= 210 && vel.x > 0)){
      this.playerObj.setLinearVelocity(new THREE.Vector3(0, vel.y, vel.z));
    }

    vel = this.playerObj.getLinearVelocity();
    this.playerObj.rotation.z = helperMethods.convertToRad(180 + (vel.x * (4.5 / 10)));
    // console.log(this.playerObj._physijs.rotation.y);
    // this.playerObj.__dirtyRotation = true;
    // console.log(this.playerObj._physijs.__dirtyRotation);
  }

  destroyByHit(scene, objs, key){
    this.clean(scene, objs, key);
    endGame(false);
  };
}


