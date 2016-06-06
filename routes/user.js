var express = require('express');
var router = express.Router();
var passport = require('passport');
var expressJWT = require('express-jwt');

var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/userModel');

router.post('/register', function(req,res){
  User.findOne({username: req.body.username}, function(err, user){
    if (err) { return done(err); }

      if (!user) {
        var user = new User();

        user.username = req.body.username;
        user.setPassword(req.body.password);

        user.save(function (err){
          if(err){ return next(err); }

          return res.json({token: user.generateJWT()});
        })
      }else{
        res.status(321);
        return res.send('Username already in use.');
      }
  })
});

passport.use('login', new LocalStrategy(function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }

      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!(user.validPassword(password))) {
        return done(null, false, { message: 'Incorrect password.' });
      }

      return done(null, user);
    });
  }
));

router.post('/login', function(req,res,next){
  passport.authenticate('login', function(err, user){
    if(err){ return next(err); }

    if (user) {
      return res.json({token: user.generateJWT()});
    } else {
      return res.status(401);
    }
  })(req, res, next);
});

module.exports = router;