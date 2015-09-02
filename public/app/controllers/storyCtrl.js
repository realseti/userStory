angular.module('storyCtrl', ['storyService'])

// passing Story as storysService object and passing socket.io object too
.controller('StoryController', function(Story, socketio) {
	var vm = this;

	Story.allStory()
		.success(function(data) {
			// assigning returned value of allStory() witch is res.json(stories); or all stories in API
			vm.stories = data;
		});

	vm.createStory = function() {
		vm.message = '';

// create is an method declared in storyService
		Story.create(vm.storyData)
			.success(function(data){

// clear up the form, storyData is a local variable
				vm.storyData = '';

// we creating a story and if it is success writing value from API return withc is ???
				vm.message = data.message;

// push the story we can see it in an instance reatime
				vm.stories.push(data);

			});
	};

// using socket.io listening when story (find that in api) we push that story in all stories realtime
	socketio.on('story', function(data) {
		vm.stories.push(data);
	});

})


.controller('AllStoriesController', function(stories, socketio) {
	var vm = this;
	vm.stories = stories.data;

	socketio.on('story', function(data) {
		vm.stories.push(data);
	});



})