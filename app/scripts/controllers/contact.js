'use strict';

zed2app.controller('ContactCtrl', function ($rootScope, $scope, $http, $location, $stateParams, ContactService, DepartmentsService, InterestsService) {

	$scope.contactSearchFormData = {};
	var apiSrc = '/api/v1';

	// $scope.departments = DepartmentsService.query(function(data) {
	// 	$scope.contactSearchFormData.dept_sun = [];
	// });

	// $scope.interests = InterestsService.query(function(data) {
	// 	$scope.contactSearchFormData.interest_sun = [];
	// });

	$scope.contactsuggest = function(orgName) {
		return $http.get(apiSrc + 'contactsuggest/' + orgName).then(function(response) {
			return response.data;
		});
	};

	$scope.search = function() {

		if ($scope.contactSearchForm.$dirty === true) {

			var params = $scope.contactSearchFormData;
			$scope.contacts = ContactService.query(params, function(u, getResponseHeaders) {

				//set order of display
				$scope.predicate = 'createddate';
				$rootScope.contactParams = params;

			});

		} else {
			console.log('no search shit!');
		}
	};

	$scope.clearForm = function() {
		$location.path('/contacts');
		$scope.contactSearchFormData = {};
		$scope.contactSearchFormData.interest_sun = [];
		$scope.contactSearchForm.$setPristine();
		delete $rootScope.contactParams;
		$scope.contacts = {};
	};

	//add new
	$scope.addNew = function() {
		$location.path('/contacts/new/contact');
	};

});
