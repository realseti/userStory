// creating first angular app, required for angular to work
angular.module('MyApp', ['appRoutes', 'mainCtrl', 'authService', 'userCtrl', 'userService', 'storyService', 'storyCtrl', 'reverseDirective'])

.config(function($httpProvider) {

	$httpProvider.interceptors.push('AuthInterceptor');

})

