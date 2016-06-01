var express = require('express');
var app = express();

app.use(express.static('node_modules'));
app.use(express.static('public'));

app.listen(8081);