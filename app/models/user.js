// this is user schema

// we should require it cause we use one of the mongose method calls schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// handle password encryption
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new Schema({
	name: String,
	username: { type: String, required: true, index: { unique: true }},
	//select false means that it doesn't going to be included in search index
	password: { type: String, required: true, select: false}
});

// handle things before saving to the database
UserSchema.pre('save', function(next) {
	var user = this;
	// next means go the next mathching route
	if(!user.isModified('password')) return next();

	bcrypt.hash(user.password, null, null, function(err, hash) {
		if(err) return next(err);

		user.password = hash;
		next();
	});

});

// creating a custom method to compare password
UserSchema.methods.comparePassword = function(password) {
	var user = this;
	return bcrypt.compareSync(password, user.password);
}

// export this user object so we can use that late on in our API
module.exports = mongoose.model('User', UserSchema);