'use strict';

zed2app.controller('SubscriberCtrl', function ($scope, $http, limitToFilter, $rootScope, SubService, $location) {

	$scope.subscriberSearchFormData = {};
	var apiSrc = '/api/v1';
	$scope.isAdvanced = false;

	$scope.subsuggest = function (subName) {
			return $http.get('api/v1/subsuggest/' + subName).then(function (response) {
					var subnames = [];
					angular.forEach(response.data, function(sub){
						subnames.push(sub.sublastname + ", " + sub.subfirstname + " " + sub.subnumber);
					});
					return subnames;
			});
	};


	$scope.search = function() {
		if ($scope.subscriberSearchForm.$dirty === true) {
				$scope.sub = {},
				$scope.subs = [];

				if ($scope.subscriberSearchFormData.subName) {
						// SMITH, JOHN 55555
						var re = /^\w*,\s\w*\s(\d*)/;
						var numberMatch = $scope.subscriberSearchFormData.subName.match(re);
						if (numberMatch){
								// get single match
								$scope.sub = SubService.get({id:numberMatch[1]});
								return;
						}
				}
				var params = $scope.subscriberSearchFormData;
				$scope.subs = SubService.query(params, function(u, getResponseHeaders){
					//set order of display
					$scope.predicate = 'createddate';
				});
		} else {
				console.log('no search shit!');
		}
	}

	$scope.clearForm = function() {
			$location.path('/subscribers');
			delete $rootScope.subscriberParams;
			delete $rootScope.subName;
			$scope.subs = {};
			$scope.sub = {};
			$scope.subscriberSearchFormData = {};
			$scope.subscriberSearchForm.$setPristine();
	};

	$scope.addNew = function () {
		$scope.sub = {};
		$location.path('/subscribers/new');
	}

	$scope.selectSub = function (selectedSub) {
		_($scope.subs).forEach(function (sub) {
			sub.selected = false;
			if (selectedSub === sub) {
				selectedSub.selected = true;
			}
		});
	};

});
