// directive (module) to reverse the stories display
angular.module('reverseDirective', [])

.filter('reverse', function () {

	return function(items) {
		if (!items || !items.length) { return; }
		return items.slice().reverse();
	}

});