var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var StorySchema = new Schema({
// we have to refert the storySchema to the userSchema, the way to do that is to refer to mongose auto created ObjectId for User oject
	creator: { type: Schema.Types.ObjectId, ref: 'User' },
	content: String,
	created: { type: Date, default: Date.now }

});

module.exports = mongoose.model('Story', StorySchema);