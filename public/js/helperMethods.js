const helperMethods = {
  //used to convert degrees to radians, mostly for rotation
  convertToRad: function(degree){
    return degree * (3.14159 / 180);
  },
  //used to get a random number between 0 and max, or, if min is given, between min and max
  getRand: function(max, min){
    if(min){
      return Math.floor(Math.random() * (max - min)) + min;
    }else{
      return Math.floor(Math.random() * max);
    }
  }
}