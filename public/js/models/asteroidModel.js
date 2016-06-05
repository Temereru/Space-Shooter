

class AsteroidModel {
  constructor(){
    // console.log(loadedAsteroids.asteroidGeometry1);
    this.asteroidObj = new Physijs.ConvexMesh(loadedAsteroids.asteroidGeometry1, loadedAsteroids.asteroidMaterial1, 1);
    this.sphere = new Physijs.SphereMesh(new THREE.SphereGeometry(50, 32, 32))
    this.sphere._physijs.collision_flags = 4;
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
    this.asteroidObj.toDestroy = false;
    this.asteroidObj.hit = false;
    this.asteroidObj.add(this.sphere);
    this.asteroidObj._physijs.collision_flags = 4;
    asteroids.push(this.asteroidObj.key);
    this.setVelocity = true;
    this.asteoidExplosionMusic = document.createElement('audio');
    this.asteoidExplosionMusic.appendChild(loadedAsteroids.asteroidExplosionMusicSource);
  };

  getStartPos(){
    let x = helperMethods.getRand(210, -210);
    let y = helperMethods.getRand(380, 350);
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
    if(this.asteroidObj.toDestroy && this.asteroidObj.hit){
      this.destroyByHit(scene, objs, key, asteroids);
    }else if(this.asteroidObj.toDestroy){
      this.clean(scene, objs, key, asteroids);
    }
    if(this.setVelocity){
      this.asteroidObj.setLinearVelocity(new THREE.Vector3(0, this.getVelocity(), 0));
      this.setVelocity = false;
    }
    if(this.asteroidObj.position.y <= -400){
      this.clean(scene, objs, key, asteroids);
    }
  };

  destroyByHit(scene, objs, key, asteroids){
    this.clean(scene, objs, key, asteroids);
    this.asteoidExplosionMusic.play();
    score += 10;
  }
}