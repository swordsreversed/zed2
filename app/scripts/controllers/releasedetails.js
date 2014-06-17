'use strict';

zed2app.controller('ReleaseDetailCtrl', function($rootScope, $scope, $http, $location, $stateParams, ReleaseService, GenresService, ThemesService, limitToFilter, $filter, release) {

	$scope.release = ($stateParams.id) ? release : new ReleaseService();
	var apiSrc = '/api/v1';

	//set vars for constants
	$scope.submitType = (!$stateParams.id) ? 'Add Release' : 'Update';
	$scope.alerts = [];
	$scope.relsuggest = [];
	$scope.ausnz = ['A', 'NZ'];
	$scope.promo = ['Promo Campaign', 'Staff Pick', 'Other'];
	$scope.format = ['CD', 'DIGITAL', 'VINYL'];
	$scope.status = ['In Library', 'Received', 'Culled', 'Rejected'];

	// $scope.genres = GenresService.query();
	$scope.genresnew = GenresService.query(function(){
		// timeout to allow select2 to render initial values
		// see https://github.com/angular-ui/ui-select2/pull/136
		if ($scope.release.genres) {
			var fakeInit = function() { $scope.gs = _.pluck($scope.release.genres, 'id'); }
			$timeout(fakeInit, 300);
		}
	});

	// $scope.themes = ThemesService.query();

	$scope.relCheck = function(artist, title) {
		$http.get(apiSrc + '/relcheck/' + artist + '/' + title).then(function(response) {
			$scope.relsuggest = response.data;
		});
	};

	$scope.labels = function(label) {
		return $http.get(apiSrc + '/labelsuggest/' + label).then(function(response) {
			return limitToFilter(response.data, 15);
		});
	};


	$scope.saveRelease = function() {

		$scope.release.genres = $scope.gs;
		if ($stateParams.id) {
			//update

			$scope.release.$update({ id: $stateParams.id }, function success(response) {
				if ($scope.alerts.length > 0) {
					$scope.alerts.splice(0, 1);
				}
				$scope.alerts.push({
					msg: 'Record ' + $stateParams.id + ' Updated!'
				});
				$scope.release = ReleaseService.get({ id: $stateParams.id });
				$anchorScroll();

			}, function err() {
				alert('Couldnt update!');
			});
		} else {
			//insert
			$scope.release.$save(function() {
				alert('Record added');
				$location.path('/releases/' + $scope.release.library_no);
			});

		}
	};

	$scope.deleteRelease = function() {
		var title = 'Warning';
		var msg = 'Are you sure you wish to delete this record?';
		var btns = [{
			result: 'cancel',
			label: 'Cancel'
		}, {
			result: 'ok',
			label: 'OK',
			cssClass: 'btn-primary'
		}];


		$dialog.messageBox(title, msg, btns)
			.open()
			.then(function(result) {
				if (result === 'ok') {
					$scope.release.$delete({
						id: $stateParams.id
					}, function() {

						alert('Record deleted');
						$location.path('/releases');

					});
				}
			});
	};


	$scope.closeAlert = function(index) {
		$scope.alerts.splice(index, 1);
	};

	$scope.add = function() {
		$location.path('/releases/new/release');
	};

})
