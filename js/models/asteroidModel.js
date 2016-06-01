

class AsteroidModel {
  constructor(){
    // console.log(loadedAsteroids.asteroidGeometry1);
    this.asteroidObj = new THREE.Mesh(loadedAsteroids.asteroidGeometry1, loadedAsteroids.asteroidMaterial1);
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
    let vel = this.getVelocity();
    this.asteroidObj.velocity = vel;
    this.asteroidObj.destroyByHit = this.destroyByHit;
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
    return {x:0,y:helperMethods.getRand(4, 2),z:0};
  }

  clean(scene, objs, key){
    for(let i = 0; i < objs.length; i++){
      if(objs[i].key === key){
        objs.splice(i, 1);
      }
    }
    scene.remove(this.asteroidObj);
  }

  manage(scene, objs, key){
    this.asteroidObj.position.y -= this.asteroidObj.velocity.y;
    if(this.asteroidObj.position.y <= -400){
      this.clean(scene, objs, key);
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
      if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ) 
        if(collisionResults[0].object.objType === "playerShot"){
          collisionResults[0].object.destroyByHit(scene, objs, key);
          this.destroyByHit(scene, objs, key);
        }
    } 
  };

  destroyByHit(scene, objs, key){
    this.clean(scene, objs, key);
  }
}