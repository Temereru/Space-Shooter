var jsonLoader = new THREE.JSONLoader();
var textureLoader = new THREE.TextureLoader();
// assuming we loaded a JSON structure from elsewhere



class PlayerModel{
  constructor(){
    this.playerObj;
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
  }

  move(direction){
    if(this.playerObj){
      switch(direction){
        case 'left':
          if(this.playerObj.position.x >= -210){
            this.playerObj.position.x -= 2;
          }
          break;
        case 'right':
          if(this.playerObj.position.x <= 210){
            this.playerObj.position.x += 2;
          }
          break;
        case 'up':
          if(this.playerObj.position.y <= 290){
            this.playerObj.position.y += 2;
          }
          break;
        case 'down':
          if(this.playerObj.position.y >= -290){
            this.playerObj.position.y -= 2;
          }
          break;
      }   
    }
  }
}


