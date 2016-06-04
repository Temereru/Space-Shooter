

class AsteroidModel {
  constructor(){
    // console.log(loadedAsteroids.asteroidGeometry1);
    this.asteroidObj = new Physijs.ConvexMesh(loadedAsteroids.asteroidGeometry1, loadedAsteroids.asteroidMaterial1);
    this.asteroidObj.scale.x = 40;
    this.asteroidObj.scale.y = 40;
    this.asteroidObj.scale.z = 40;
    let pos = this.getStartPos();
    this.asteroidObj.position.y = pos.y;
    this.asteroidObj.position.x = pos.x;
    let rot = this.getRot();
    this.asteroidObj.rotation.x = rot.x;
    this.asteroidObj.rotation.y = rot.y;
    this.asteroidObj.rotation.z = rot.z;
    this.asteroidObj.destroyByHit = this.destroyByHit;
    this.asteroidObj.objType = "asteroid";
    this.asteroidObj.key = helperMethods.getRand(1000000);
    asteroids.push(this.asteroidObj.key);

    this.setVelocity = true;
  };

  getStartPos(){
    let x = helperMethods.getRand(210, -210);
    let y = helperMethods.getRand(340, 320);
    return {x:x,y:y}
  }

  getRot(){
    let x = helperMethods.getRand(360);
    let y = helperMethods.getRand(360);
    let z = helperMethods.getRand(360);
    return new THREE.Euler( helperMethods.convertToRad(x),helperMethods.convertToRad(y),helperMethods.convertToRad(z), 'XYZ' );
  }

  getVelocity(){
    return helperMethods.getRand(-100, -150);
  }

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

  manage(scene, objs, key, asteroids){
    if(this.setVelocity){
      this.asteroidObj.setLinearVelocity(new THREE.Vector3(0, this.getVelocity(), 0));
      this.setVelocity = false;
    }
    if(this.asteroidObj.position.y <= -400){
      this.clean(scene, objs, key, asteroids);
    }

    var originPoint = this.asteroidObj.position.clone();
    
    for (var vertexIndex = 0; vertexIndex < this.asteroidObj.geometry.vertices.length; vertexIndex++)
    {   
      var localVertex = this.asteroidObj.geometry.vertices[vertexIndex].clone();
      var globalVertex = localVertex.applyMatrix4( this.asteroidObj.matrix );
      var directionVector = globalVertex.sub( this.asteroidObj.position );
      var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
      // console.log(ray);
      var collisionResults = ray.intersectObjects( collidableMeshList );
      if ( collisionResults.length > 0 && collisionResults[0].distance < 40 )
      {
        // console.log(directionVector.length());
        if(collisionResults[0].object.objType === "playerShot"){
          collisionResults[0].object.destroyByHit(scene, objs, key);
          this.destroyByHit(scene, objs, key, asteroids);
        }else if(collisionResults[0].object.objType === "player"){     
          collisionResults[0].object.destroyByHit(scene, objs, key);
          this.destroyByHit(scene, objs, key, asteroids);
        }
      }
    } 
  };

  destroyByHit(scene, objs, key, asteroids){
    this.clean(scene, objs, key, asteroids);
    score += 10;
  }

  addToCollision(other_object){
    this.asteroidObj.addEventListener( 'collision', function(other_object, relative_velocity, relative_rotation, contact_normal) {
      console.log('hit');
      // `this` has collided with `other_object` with an impact speed of `relative_velocity` and a rotational force of `relative_rotation` and at normal `contact_normal`
    });
  };
}