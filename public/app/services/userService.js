// user signup service that uses  /signup and /users in api.js
angular.module('userService', [])

.factory('User', function($http) {
	var userFactory = {};

// creating new user
	userFactory.create = function(userData){
//fetching the data from node.js through api
		return $http.post('/api/signup', userData)
	}

// getting all users
	userFactory.all = function() {
		return $http.get('/api/users');
	}

	return userFactory
});