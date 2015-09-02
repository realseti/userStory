// all API goes here

var User = require('../models/user');

var Story = require('../models/story');

// need to add that cause we need to use SecretKey
var config = require('../../config');
var secretKey = config.secretKey;

var jsonwebtoken = require('jsonwebtoken');

// creating token for login api
function createToken(user) {
	var token = jsonwebtoken.sign({
		id: user._id,
		name: user.name,
		username: user.username
	}, secretKey, {
		expiresInMinute: 1440
	});

	return token;
}

// exporting entire API
module.exports = function(app, express, io) {

// need to call express router to write an API, i believe to use post methods	
	var api = express.Router();

// all stories route to display stories from everyone for everyone
	api.get('/all_stories', function(req, res) {
		Story.find({}, function(err, stories) {
			if(err) {
				res.send(err);
				return;
			}
			res.json(stories);
		});
	});

	api.post('/signup', function(req, res) {

// all user data for userSchema and read the values from the website post method
		var user = new User({
			name: req.body.name,
			username: req.body.username,
			password: req.body.password
		});

		var token = createToken(user);

// save user data to the databse
		user.save(function(err) {
			if(err) {
				res.send(err);
				return;
			}
			res.json({ 
				success: true,
				message: 'User has been created',
				token: token
			});
		});
	});

// another api that get (fetching) users from the databse
	api.get('/users', function(req, res) {

// mongose find method finding every User objects {} in the database
		User.find({}, function(err, users) {
			if(err) {
				res.send(err);
				return;
			}

// response with all users
			res.json(users);
		});
	});

// api for setting up authentification token or login
	api.post('/login', function(req, res) {

// find a specific user object
		User.findOne({
			username: req.body.username

// selecting a password and other info for panel to display
		}).select('name username password').exec(function(err, user) {
			if(err) throw err;
			if(!user) {
				res.send({vmessage: "User don't exist" });

// if user exist
			} else if(user) {

// compare passwords using the custom method in user schema
				var validPassword = user.comparePassword(req.body.password);

				if(!validPassword) {
					res.send({ message: "Invalid Password" });
				} else {
					
// create a token using jsonwebtoken lib
					var token = createToken(user);

// providing token for the angular service / controller part
					res.json({
						success: true,
						message: "Succesfully Login",
						token: token
					});
				}
			}
		});
	});

// authentification middleware to get and verify the token then next() - go to the next below this middleware
	api.use(function(req, res, next) {
		console.log ("Somebody just came to our app");

// check if token is somewhere is in the document
		var token = req.body.token || req.param('token') || req.headers['x-access-token'];

// check if token exist
		if(token) {

// verify the token
			jsonwebtoken.verify(token, secretKey, function(err, decoded) {
				if(err) {
					res.status(403).send({ success: false, message: "Failed to authentificate user"});
				} else {

// sucess, token good
					req.decoded = decoded;

// next go the next destination with is below this middleware
					next();
				}
			});
		} else {
			res.status(403).send({ success: false, message: "Token not provided" })
		}
	});

// everething below that require legitimate token and has decoded values

// chaining method for both post and get request on one route with is /
	api.route('/')

// create and save new stories in to the database
	.post(function(req, res) {

		var story = new Story ({

// request the user from decoded token
			creator: req.decoded.id,

// request story content from the body
			content: req.body.content

		});

// saving the user story to the database + pass newStory when story created
		story.save(function(err, newStory) {
			if(err) {
				res.send(err);
			}
			// emitting io to render newStory in realtime
			io.emit('story', newStory);
			res.json({ message: "new story created!" });
		});
	})

// getting all user stories from the database
	.get(function(req, res) {

// find all stories in Stury object by decoded user if from the token
		Story.find({ creator: req.decoded.id }, function(err, stories) {
			if (err) {
				res.send(err);
				return;
			}

// response with a stories
			res.json(stories);
		});

	});

// we need to get the user information for later use in angular
	api.get('/me', function(req, res) {
		res.json(req.decoded);
	});

	return api

}