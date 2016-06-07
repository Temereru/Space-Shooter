var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
var expressJWT = require('express-jwt');

var User = require('./models/userModel');
var Game = require('./models/gameModel');
var userRoutes = require('./routes/user');
var serverDef = require('./serverDef');

mongoose.connect('mongodb://localhost/space-shooter');

var auth = expressJWT({secret: 'ravenclaw'});

serverDef.app.use(bodyParser.json());
serverDef.app.use(bodyParser.urlencoded({extended: false}));

serverDef.app.use(passport.initialize());

serverDef.app.use(serverDef.express.static('node_modules'));
serverDef.app.use(serverDef.express.static('public'));

serverDef.app.use('/user', userRoutes);


serverDef.io.on('connection', function(socket){
  Game.findOne({name: 'single'}, function(err, game){
    socket.emit('scores', game.scoreBoard);
  });
});

  // var game = new Game();
  // game.name = 'single';
  // for(i = 0; i < 10; i++){
  //   game.scoreBoard[i] = {username: '', score: 0}
  //   game.save(function(){});
  // }


serverDef.app.listen(8081);
serverDef.server.listen(8082);