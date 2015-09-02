angular.module('userCtrl', ['userService'])

// getting all users, function(User) reference to the userService factory(User)
.controller('UserController', function(User) {
	var vm = this;

// method .all hast to be the same as a service object in userService.js
	User.all()
		.success(function(data) {
			vm.users = data;
		})

})

// creating a user, $location for redirection to the home page, $window to store the token in local storage
.controller('UserCreateController', function(User, $location, $window) {

	var vm = this;

	vm.signupUser = function() {

		vm.messsage = '';
// again should be exacly as in services object
		User.create(vm.userData)

			.then(function(response) {

				vm.userData = {};
				vm.message = response.data.message;
// store the token
				$window.localStorage.setItem('token', response.data.token);
// redirecting to home
				$location.path('/');
			})
	}
})

