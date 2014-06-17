'use strict';

zed2app.controller('SubDetailsCtrl', function ($scope, $http, $stateParams, $location, SubService, SubtypesService, ProgramService) {
	$scope.sub =  SubService.get({ id: $stateParams.id }, function(sub, getResponseHeaders){
		$scope.fullname = sub.subfirstname + ' ' + sub.sublastname;
  });
	var apiSrc = '/api/v1';

	// $http.get('/api/subscribers/' + $stateParams.id).success(function(sub) {
	// 	$scope.sub = sub;
	// 	$scope.fullname = sub.subfirstname + ' ' + sub.sublastname;
	// });
	$scope.subtypes = SubtypesService.query();
	$scope.programs = ProgramService.query();
	$scope.gender = [{
        id: 1,
        desc: 'MALE'
      }, {
        id: 2,
        desc: 'FEMALE'
      }, {
        id: 3,
        desc: 'TRANS'
      }];


	$scope.suburbsuggest = function (suburb) {
			return $http.get(apiSrc + '/suburbsuggest/' + suburb).then(function (response) {
					return response.data;
			});
	};

	$scope.saveSub = function(sub) {
		//TODO: Sanitize and validate form

		if ($scope.subForm.$valid) {
			if ($scope.sub.subnumber) {
				$scope.sub.$update({id: $stateParams.id}, function success(response) {
				//$http.put('/api/subscribers/'  + $stateParams.id, sub).success(function(data) {
					$scope.saved = 'Subscriber updated!';
					$scope.sub = response;
				});
			} else {
				$scope.sub.$save(function success(response) {
					$location.path('/subscribers/' + response.subnumber);
					$scope.saved = 'Subscriber saved!';
				});
			}

		} else {
			console.log('nope');
		}
	};

	$scope.onSuburbChange = function ($item, $model, $label) {
		//item = suburb object, model = val (id), label = name
		console.log($scope.sub.suburb_id);
		console.log($item);
		$scope.sub.suburb_id = $item.postcode;
		angular.extend($scope.sub.suburb, $item);
		//$scope.sub.suburb = $item;
		console.log($scope.sub.suburb);
	};


});
