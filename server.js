var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
var expressJWT = require('express-jwt');

var User = require('./models/userModel');
var userRoutes = require('./routes/user');

mongoose.connect('mongodb://localhost/space-shooter');

var auth = expressJWT({secret: 'ravenclaw'});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(passport.initialize());

app.use(express.static('node_modules'));
app.use(express.static('public'));

app.use('/user', userRoutes);

app.listen(8081);