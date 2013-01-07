var app = angular.module('plunker', []);

app.controller('MainCtrl', function($scope, topologicalSort) {
  $scope.elements = []; // elements to sort
  $scope.form = {
		select: null, // selected element
		text: "" // name of the element to be added
	};
  /**
   * Add an element to elements and reset the text form
   */
	$scope.add = function() {
    $scope.elements.push({ name:$scope.form.text, require:{} });
    $scope.form.text = "";
	};
  /**
   * Toggle the selected element require value
   * @param name of the required (or not) element
   */
	$scope.requiredChanged = function(name) {
		$scope.form.select.require[name] = !$scope.form.select.require[name];
	};
  /**
   * Sort the elements and attach the result
   */
	$scope.sort = function() {
		$scope.result = topologicalSort($scope.elements);
	};
});
