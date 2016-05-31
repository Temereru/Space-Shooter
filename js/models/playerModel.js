var jsonLoader = new THREE.JSONLoader();
var textureLoader = new THREE.TextureLoader();
// assuming we loaded a JSON structure from elsewhere



class PlayerModel{
  constructor(){
    this.playerObj;
    this.velocity = {
      x:0,
      y:0,
      z:0
    };
  }


  load(callback){
    let that = this;
    jsonLoader.load('../../assets/models/playerShip.json', function(geometry, material){
      textureLoader.load('../../assets/textures/vehicle_playerShip_orange_dff.png', function(texture){
        var playerMaterial = new THREE.MeshBasicMaterial( { map: texture} );
        console.log(that);
        that.playerObj = new THREE.Mesh(geometry, playerMaterial);
        that.playerObj.rotation.x = helperMethods.convertToRad(90);
        that.playerObj.rotation.y = helperMethods.convertToRad(180);
        that.playerObj.scale.x = 40;
        that.playerObj.scale.y = 40;
        that.playerObj.scale.z = 40;
        // playerObj.rotation.z = 5;
        that.playerObj.position.y = -280;
        callback(that, that.playerObj);
      });
    });
  }

  manage(){
    //if the player arrives at bounding box dimensions, stop it.
    if((this.playerObj.position.x <= -210 && this.velocity.x < 0)||(this.playerObj.position.x >= 210 && this.velocity.x > 0)){
      this.velocity.x = 0
    }
    if((this.playerObj.position.y >= 290 && this.velocity.y > 0)|| (this.playerObj.position.y <= -290 && this.velocity.y < 0)){
      this.velocity.y = 0;
    }

    //if the player was set a velocity in both axis
    if(this.velocity.x !== 0  && this.velocity.y !== 0){
      this.playerObj.position.x += this.velocity.x;
      this.playerObj.position.y += this.velocity.y;
      this.velocity.x = this.velocity.x / 1.1;
      //if the velocity is between the given values, terminate movement;
      if(this.velocity.x < 0.15 && this.velocity.x > -0.15){
        this.velocity.x = 0;
      }
      this.velocity.y = this.velocity.y / 1.1;
      if(this.velocity.y < 0.15 && this.velocity.y > -0.15){
        this.velocity.y = 0;
      }
      //if the player was set a velocity in the X axis
    }else if(this.velocity.x !== 0){
      this.playerObj.position.x += this.velocity.x;
      this.velocity.x = this.velocity.x / 1.1;
      if(this.velocity.x < 0.15 && this.velocity.x > -0.15){
        this.velocity.x = 0;
      }
      //if the player was set a velocity in the X axis
    }else if(this.velocity.y !== 0){
      this.playerObj.position.y += this.velocity.y;
      this.velocity.y = this.velocity.y / 1.1;
      if(this.velocity.y < 0.15 && this.velocity.y > -0.15){
        this.velocity.y = 0;
      }
    }
  }

  move(direction){
    if(this.playerObj){
      switch(direction){
        case 'left':
          this.velocity.x--;
          if(this.velocity.x <= -3){
            this.velocity.x = -3;
          }
          break;
        case 'right':
          this.velocity.x++;
          if(this.velocity.x >= 3){
            this.velocity.x = 3;
          }
          break;
        case 'up':
          this.velocity.y++;
          if(this.velocity.y >= 3){
            this.velocity.y = 3;
          }
          break;
        case 'down':
          this.velocity.y--;
          if(this.velocity.y <= -3){
            this.velocity.y = -3;
          }
          break;
      }   
    }
  }
}


