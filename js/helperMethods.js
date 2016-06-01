const helperMethods = {
  convertToRad: function(degree){
    return degree * (3.14159 / 180);
  },

  getRand: function(max, min){
    if(min){
      return Math.floor(Math.random() * max) - min;
    }else{
      return Math.floor(Math.random() * max);
    }
  }
}