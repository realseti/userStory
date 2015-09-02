// angular routing system
angular.module('appRoutes', ['ngRoute'])

// this belongs to ng route controller
.config(function($routeProvider, $locationProvider) {
// routing chain
	$routeProvider

// adding MainController to call from home.html as main
		.when('/', {
			templateUrl: 'app/views/pages/home.html',
			controller: 'MainController',
			controllerAs: 'main'
		})
		.when('/login', {
			templateUrl: 'app/views/pages/login.html'
		})
		.when('/signup', {
			templateUrl: 'app/views/pages/signup.html'
		})

// compare this to home.html for the different way of adding a controllers to the page
		.when('/allStories', {
			templateUrl: 'app/views/pages/allStories.html',
			controller: 'AllStoriesController',
			controllerAs: 'story',
// not load the entire thing, resolve render the data on the same time
			resolve: {

// Story and allStories is form the services
				stories: function(Story) {
					return Story.allStories();
				}
			}
		})

// to configure how the applicaton linking path is stored
	$locationProvider.html5Mode(true);
})