var express = require('express');
var router = express.Router();
var passport = require('passport');
var expressJWT = require('express-jwt');
var serverDef = require('../serverDef');

var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/userModel');
var Game = require('../models/gameModel');

var auth = expressJWT({secret: 'ravenclaw'});

router.post('/register', function(req,res){
  User.findOne({username: req.body.username}, function(err, user){
    if (err) { return done(err); }

      if (!user) {
        var user = new User();

        user.username = req.body.username;
        user.setPassword(req.body.password);
        for(var i = 0; i < 10; i++){
          user.scores.push(0);
        }

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
  passport.authenticate('login', function(err, user, error){
    if(err){ return next(err); }
    if (user) {
      return res.json({token: user.generateJWT()});
    } else {
      res.status(401);
      return res.send(error.message);
    }
  })(req, res, next);
});

router.post('/score/:id', auth, function(req, res, next){
  User.findById(req.params.id, function(err, user){
    if(err) {return next(err)}

    if(!user){
      res.status(401);
      return res.send('User ID do not match');
    }

    var tempArr = [];
    var lowest = req.body.score;
    for(var i = 0; i < user.scores.length; i++){
      if(user.scores[i] > lowest){
        tempArr.push(user.scores[i]);
      }else{
        tempArr.push(lowest);
        lowest = user.scores[i];
      }
    }
    user.scores = tempArr;
    user.save(function(err, user){
      Game.findOne({name: 'single'}, function(err, game){
        if(err) {return next(err)}

        if(game){
          var tempArr = [];
          var lowest = {user: user.username, score:req.body.score};
          for(var j = 0; j < game.scoreBoard.length; j++){
            if(game.scoreBoard[j].score >= lowest.score){
              tempArr.push(game.scoreBoard[j]);
            }else{
              tempArr.push(lowest);
              lowest = game.scoreBoard[j];
            }
          }
          game.scoreBoard = tempArr;
          game.save(function(err, game){
            serverDef.io.emit('scores', game.scoreBoard);
            return res.send(user.scores);
          });
        }
      });
      
    });
  })
})

router.get('/score/:id', auth, function(req, res, next){
  User.findById(req.params.id, function(err, user){
    if(err) {return next(err)}

    if(!user){
      res.status(401);
      return res.send('User ID do not match');
    }

    res.send(user.scores);

  })
})

module.exports = router;