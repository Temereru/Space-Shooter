

class AsteroidModel {
  constructor(){
    // console.log(loadedAsteroids.asteroidGeometry1);
    this.asteroidObj = new THREE.Mesh(loadedAsteroids.asteroidGeometry1, loadedAsteroids.asteroidMaterial1);
    this.asteroidObj.scale.x = 40;
    this.asteroidObj.scale.y = 40;
    this.asteroidObj.scale.z = 40;
    this.asteroidObj.position.y = 200;
    this.asteroidObj.destroyByHit = this.destroyByHit;
  };

  clean(scene, objs, i){
    objs.splice(i, 1);
    scene.remove(this.asteroidObj);
  }

  manage(scene, objs, i){
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
        if(collisionResults[0].object.type === "playerShot"){
          collisionResults[0].object.destroyByHit(scene, objs, i);
          this.destroyByHit(scene, objs, i);
        }
    } 
  };

  destroyByHit(scene, objs, i){
    this.clean(scene, objs, i);
  }
}