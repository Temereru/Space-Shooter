var jsonLoader = new THREE.JSONLoader();
var textureLoader = new THREE.TextureLoader();
// assuming we loaded a JSON structure from elsewhere

var playerObj;

var playerModel = {
  load: function(callback){
    jsonLoader.load('../../assets/models/playerShip.json', function(geometry, material){
      textureLoader.load('../../assets/textures/vehicle_playerShip_orange_dff.png', function(texture){
        var playerMaterial = new THREE.MeshBasicMaterial( { map: texture} );
        playerObj = new THREE.Mesh(geometry, playerMaterial);
        playerObj.rotation.x = helperMethods.convertToRad(90);
        playerObj.rotation.y = helperMethods.convertToRad(180);
        playerObj.scale.x = 40;
        playerObj.scale.y = 40;
        playerObj.scale.z = 40;
        playerObj.position.y = -280;
        callback(playerObj);
      });
    });
  },

  move: function(direction){
    if(playerObj){
      for (var i in keys) {
        if (!keys.hasOwnProperty(i)) continue;
        switch(i){
        case '37':
          if(playerObj.position.x >= -210){
            playerObj.position.x -= 2;
          }
          break;
        case '39':
          if(playerObj.position.x <= 210){
            playerObj.position.x += 2;
          }
          break;
        case '38':
          if(playerObj.position.y <= 290){
            playerObj.position.y += 2;
          }
          break;
        case '40':
          if(playerObj.position.y >= -290){
            playerObj.position.y -= 2;
          }
          break;
      }
      }
      
    }
  }
}


