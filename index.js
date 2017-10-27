var express = require('express');
var cors = require('cors');
var app = express();

var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors());
var server = require('./endpoints.js')(app);

//var server = app.listen(3000, function(){
//    console.log('Server running at http://127.0.0.1:3000')
//})

var port = process.env.PORT || 1337;
server.listen(port);