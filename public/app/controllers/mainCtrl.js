// contorller is a way to manipulate the data to give to it views that render the data
angular.module('mainCtrl', [])

// Auth is from the authService.js
.controller('MainController', function($rootScope, $location, Auth) {
	var vm = this;
	vm.loggedIn = Auth.isLoggedIn();

// check login user in any request (route is changeing)
	$rootScope.$on('$routeChangeStart', function() {

		vm.loggedIn = Auth.isLoggedIn();

		Auth.getUser()
			.then(function(data) {
// getting all the data from user
				vm.user = data.data
			});
	});

// to do login submit
	vm.doLogin = function () {

		vm.processing = true;
		vm.error = '';

// passing the login data to the authService
		Auth.login(vm.loginData.username, vm.loginData.password)
			.success(function(data) {
				vm.processing = false;
// getting all the data from user
				Auth.getUser()
					.then(function(data) {
						vm.user = data.data;
					});

				if(data.success)
					$location.path('/');
				else
					vm.error = data.message;
			});
	}

// do logout
	vm.doLogout = function() {
		Auth.logout();
		$location.path('/logout');
	}

});