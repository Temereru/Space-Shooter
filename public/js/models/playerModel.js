
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
    this.speed = 15;
    this.direction = {
      left: false,
      right: false,
      up: false,
      down: false
    }
    this.drag = 1.03;
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
    let vel = this.playerObj.getLinearVelocity();
    if(this.direction.left){
      vel = this.playerObj.getLinearVelocity();
      vel.x -= this.speed;
      if(vel.x <= -5 * this.speed){
        this.playerObj.setLinearVelocity(new THREE.Vector3(-5 * this.speed, vel.y, vel.z));
        console.log(vel.x);
      }else{
        this.playerObj.setLinearVelocity(new THREE.Vector3(vel.x, vel.y, vel.z));
      }
    }else if(!this.direction.right && vel.x < 0){
      vel = this.playerObj.getLinearVelocity();
      let delta = (vel.x / this.drag) < -5 ? vel.x / this.drag : 0;
      this.playerObj.setLinearVelocity(new THREE.Vector3(delta, vel.y, vel.z));
    }
    if(this.direction.right){
      vel = this.playerObj.getLinearVelocity();
      vel.x += this.speed;
      if(vel.x >= 5 * this.speed){
        console.log(vel.x);
        this.playerObj.setLinearVelocity(new THREE.Vector3(5 * this.speed, vel.y, vel.z));
      }else{
        this.playerObj.setLinearVelocity(new THREE.Vector3(vel.x, vel.y, vel.z));
      } 
    }else if(!this.direction.left && vel.x > 0){
      vel = this.playerObj.getLinearVelocity();
      let delta = (vel.x / this.drag) > 5 ? vel.x / this.drag : 0;
      this.playerObj.setLinearVelocity(new THREE.Vector3(delta, vel.y, vel.z));
    }
    if(this.direction.up){
      vel = this.playerObj.getLinearVelocity();
      vel.y += this.speed;
      if(vel.y >= 5 * this.speed){
        this.playerObj.setLinearVelocity(new THREE.Vector3(vel.x, 5 * this.speed, vel.z));
      }else{
        this.playerObj.setLinearVelocity(new THREE.Vector3(vel.x, vel.y, vel.z));
      }
    }else if(!this.direction.down && vel.y > 0){
      vel = this.playerObj.getLinearVelocity();
      let delta = (vel.y / this.drag) > 5 ? vel.y / this.drag : 0;
      this.playerObj.setLinearVelocity(new THREE.Vector3(vel.x, delta, vel.z));
    }
    if(this.direction.down){
      vel = this.playerObj.getLinearVelocity();
      vel.y -= this.speed;
      if(vel.y <= -5 * this.speed){
        this.playerObj.setLinearVelocity(new THREE.Vector3(vel.x, -5 * this.speed, vel.z));
      }else{
        this.playerObj.setLinearVelocity(new THREE.Vector3(vel.x, vel.y, vel.z));
      }
    }else if(!this.direction.up && vel.y < 0){
      vel = this.playerObj.getLinearVelocity();
      let delta = (vel.y / this.drag) < -5 ? vel.y / this.drag : 0;
      this.playerObj.setLinearVelocity(new THREE.Vector3(vel.x, delta, vel.z));
    }

    vel = this.playerObj.getLinearVelocity();
    if((this.playerObj.position.x <= -210 && vel.x < 0)||(this.playerObj.position.x >= 210 && vel.x > 0)){
      this.playerObj.setLinearVelocity(new THREE.Vector3(0, vel.y, vel.z));
    }
    if((this.playerObj.position.y >= 290 && vel.y > 0)|| (this.playerObj.position.y <= -290 && vel.y < 0)){
      this.playerObj.setLinearVelocity(new THREE.Vector3(vel.x, 0, vel.z));
    }



    // //if the player was set a velocity in both axis
    // if(this.playerObj._physijs.linearVelocity.x !== 0  && this.playerObj._physijs.linearVelocity.y !== 0){
    //   this.playerObj.position.x += this.playerObj._physijs.linearVelocity.x;
    //   this.playerObj.position.y += this.playerObj._physijs.linearVelocity.y;
    //   this.playerObj.__dirtyPosition = true;
    //   this.playerObj._physijs.linearVelocity.x = this.playerObj._physijs.linearVelocity.x / 1.1;
    //   //if the velocity is between the given values, terminate movement;
    //   if(this.playerObj._physijs.linearVelocity.x < 0.15 && this.playerObj._physijs.linearVelocity.x > -0.15){
    //     this.playerObj._physijs.linearVelocity.x = 0;
    //   }
    //   this.playerObj._physijs.linearVelocity.y = this.playerObj._physijs.linearVelocity.y / 1.1;
    //   if(this.playerObj._physijs.linearVelocity.y < 0.15 && this.playerObj._physijs.linearVelocity.y > -0.15){
    //     this.playerObj._physijs.linearVelocity.y = 0;
    //   }
    //   //if the player was set a velocity in the X axis
    // }else if(this.playerObj._physijs.linearVelocity.x !== 0){
    //   this.playerObj.position.x += this.playerObj._physijs.linearVelocity.x;
    //   this.playerObj.__dirtyPosition = true;
    //   this.playerObj._physijs.linearVelocity.x = this.playerObj._physijs.linearVelocity.x / 1.1;
    //   if(this.playerObj._physijs.linearVelocity.x < 0.15 && this.playerObj._physijs.linearVelocity.x > -0.15){
    //     this.playerObj._physijs.linearVelocity.x = 0;
    //   }
    //   //if the player was set a velocity in the X axis
    // }else if(this.playerObj._physijs.linearVelocity.y !== 0){
    //   this.playerObj.position.y += this.playerObj._physijs.linearVelocity.y;
    //   this.playerObj.__dirtyPosition = true;
    //   this.playerObj._physijs.linearVelocity.y = this.playerObj._physijs.linearVelocity.y / 1.1;
    //   if(this.playerObj._physijs.linearVelocity.y < 0.15 && this.playerObj._physijs.linearVelocity.y > -0.15){
    //     this.playerObj._physijs.linearVelocity.y = 0;
    //   }
    // }
  }



  move(direction){
    if(this.playerObj){
      let vel = this.playerObj.getLinearVelocity();
      switch(direction){
        case 'left':
          
          break;
        case 'right':

          break;
        case 'up':
          
          break;
        case 'down':

          break;
      }   
    }
  };

  destroyByHit(scene, objs, key){
    this.clean(scene, objs, key);
    for(let i = 0; i < collidableMeshList.length; i++){
      if(collidableMeshList[i].uuid === this.uuid){
        collidableMeshList.splice(i, 1);
      }
    }
    endGame(false);
  }

  addToCollision(other_object){
      this.playerObj.addEventListener( 'collision', function(other_object, relative_velocity, relative_rotation, contact_normal) {
        console.log('hit');
        // `this` has collided with `other_object` with an impact this.speed of `relative_velocity` and a rotational force of `relative_rotation` and at normal `contact_normal`
      });
  };
}


