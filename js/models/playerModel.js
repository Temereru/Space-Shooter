
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
    this.playerObj.velocity = {
      x:0,
      y:0,
      z:0
    };
    this.playerObj.objType = 'player';
    this.playerObj.destroyByHit = this.destroyByHit;
    this.playerObj.clean = this.clean;
    callback(this, this.playerObj);
    collidableMeshList.push(player.playerObj);
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
    //if the player arrives at bounding box dimensions, stop it.
    if((this.playerObj.position.x <= -210 && this.playerObj.velocity.x < 0)||(this.playerObj.position.x >= 210 && this.playerObj.velocity.x > 0)){
      this.playerObj.velocity.x = 0
    }
    if((this.playerObj.position.y >= 290 && this.playerObj.velocity.y > 0)|| (this.playerObj.position.y <= -290 && this.playerObj.velocity.y < 0)){
      this.playerObj.velocity.y = 0;
    }

    //if the player was set a velocity in both axis
    if(this.playerObj.velocity.x !== 0  && this.playerObj.velocity.y !== 0){
      this.playerObj.position.x += this.playerObj.velocity.x;
      this.playerObj.position.y += this.playerObj.velocity.y;
      this.playerObj.__dirtyPosition = true;
      this.playerObj.velocity.x = this.playerObj.velocity.x / 1.1;
      //if the velocity is between the given values, terminate movement;
      if(this.playerObj.velocity.x < 0.15 && this.playerObj.velocity.x > -0.15){
        this.playerObj.velocity.x = 0;
      }
      this.playerObj.velocity.y = this.playerObj.velocity.y / 1.1;
      if(this.playerObj.velocity.y < 0.15 && this.playerObj.velocity.y > -0.15){
        this.playerObj.velocity.y = 0;
      }
      //if the player was set a velocity in the X axis
    }else if(this.playerObj.velocity.x !== 0){
      this.playerObj.position.x += this.playerObj.velocity.x;
      this.playerObj.__dirtyPosition = true;
      this.playerObj.velocity.x = this.playerObj.velocity.x / 1.1;
      if(this.playerObj.velocity.x < 0.15 && this.playerObj.velocity.x > -0.15){
        this.playerObj.velocity.x = 0;
      }
      //if the player was set a velocity in the X axis
    }else if(this.playerObj.velocity.y !== 0){
      this.playerObj.position.y += this.playerObj.velocity.y;
      this.playerObj.__dirtyPosition = true;
      this.playerObj.velocity.y = this.playerObj.velocity.y / 1.1;
      if(this.playerObj.velocity.y < 0.15 && this.playerObj.velocity.y > -0.15){
        this.playerObj.velocity.y = 0;
      }
    }
  }



  move(direction){
    if(this.playerObj){
      switch(direction){
        case 'left':
          this.playerObj.velocity.x--;
          if(this.playerObj.velocity.x <= -3){
            this.playerObj.velocity.x = -3;
          }
          break;
        case 'right':
          this.playerObj.velocity.x++;
          if(this.playerObj.velocity.x >= 3){
            this.playerObj.velocity.x = 3;
          }
          break;
        case 'up':
          this.playerObj.velocity.y++;
          if(this.playerObj.velocity.y >= 3){
            this.playerObj.velocity.y = 3;
          }
          break;
        case 'down':
          this.playerObj.velocity.y--;
          if(this.playerObj.velocity.y <= -3){
            this.playerObj.velocity.y = -3;
          }
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
        // `this` has collided with `other_object` with an impact speed of `relative_velocity` and a rotational force of `relative_rotation` and at normal `contact_normal`
      });
  };
}


