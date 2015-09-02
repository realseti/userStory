// main file

// express need to run the server? for example listen on port 3000
var express = require('express');
// parse data in certain formats
var bodyParser = require('body-parser');
// morgan does display things in terminal
var morgan = require('morgan');
// reauire the config data 
var config = require('./config');
// handling connections with a database
var mongoose = require('mongoose');

var http = require('http');

var app = express();

// i don't know that is for. maybe as a middleman between app.exrpess and socket
var server = http.Server(app);

var io = require('socket.io')(server);

// handle database connection
mongoose.connect(config.database, function(err) {
	if(err) {
		console.log(err);
	}else {
		console.log('connected to the databse');
	}
});

// extended means that parser may parse anything including images, if false it handle onle text
app.use(bodyParser.urlencoded({ extended: true}));

// means that it parse json values
app.use(bodyParser.json());

// log all the request to the console
app.use(morgan('dev'));

// middleware that render all public files in /public, without it public files wouldn't be accessible, it has to be before app.get
app.use(express.static(__dirname + '/public'));

// (app, express) pass that parameters for module.export - need to call this as a parameters otherwise it would treat it as local var
var api = require('./app/routes/api')(app, express, io);

// prefix for route localhost:3000/api/signup
app.use('/api', api);

// make all pages display static index.html file
app.get('*', function(req, res){
	res.sendFile(__dirname + '/public/app/views/index.html');
});

// starting the server to listen on port that is the config ... before socket.oi it was app.listen
server.listen(config.port, function(err) {
	if(err) {
		console.log(err);
	} else {
		console.log("Listening on port 3000")
	}
});