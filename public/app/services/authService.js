// creating authService angular application
angular.module('authService', [])

// .factory is a method to ftech API from the server (http)
.factory('Auth', function($http, $q, AuthToken) {

	var authFactory = {};

// get the API to login the user and then save it to the front end
	authFactory.login = function(username, password) {
		return $http.post('/api/login', {
			username: username,
			password: password
		})

// promise function if sucess login then save token on the user side
		.success(function(data) {
			AuthToken.setToken(data.token);
			return data;
		})
	}

// set empty token
	authFactory.logout = function() {
		AuthToken.setToken();
	}

// check if user logeed in / has a token
	authFactory.isLoggedIn = function() {
		if(AuthToken.getToken())
			return true;
		else
			return false;
	}

// get a user info from the token
	authFactory.getUser = function() {
		if(AuthToken.getToken())
			return $http.get('/api/me');
		else
			return $q.reject({ message: "User has no tokne"});
	}

	return authFactory;

})

// another factory to get/set/remove token in a browser
// $window is a way to get token from the browser
.factory('AuthToken', function($window) {
	var authTokenFactory = {};

	authTokenFactory.getToken = function() {
		return $window.localStorage.getItem('token');
	}

	authTokenFactory.setToken = function(token) {
		if(token)
// setting up the token in the local storage of a browser
			$window.localStorage.setItem('token', token);
		else
			$window.localStorage.removeItem('token');
	}

	return authTokenFactory;
})


// check for any request if there is a token or not and set it to the header
//$q is a promise object
.factory('AuthInterceptor', function($q, $location, AuthToken) {
	var interceptorFactory = {};

	interceptorFactory.request = function(config) {
// getting the token from a local storage
		var token = AuthToken.getToken();
		if(token) {
// setting the token in header
			config.headers['x-access-token'] = token;
		}
		return config;
	};

// error checkig if user doesn't have token
	interceptorFactory.responseError = function(response) {
// if forbidden
		if (response.status == 403)
// redirect to the login page
			$location.path('/login');
// return promise object with a parameter of responce
		return $q.reject(response);
	}

	return interceptorFactory;

});



