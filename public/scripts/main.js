'use strict';

var zed2app = zed2app || angular.module('zed2App', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ngAnimate',
  'ui.router',
  'mm.foundation',
  'ui.bootstrap',
  'ui.select2'
])
.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
	$urlRouterProvider.otherwise('/home');
	var viewsDir = 'partials';

var subscribers = {
		name: 'subscribers',
		abstract: true,
		url: '/subscribers',
		templateUrl: viewsDir + '/subscriber.html',
		controller: 'SubscriberCtrl'
	},
	sublist = {
		name: 'subscribers.list',
		parent: subscribers,
		url: '',
		templateUrl: viewsDir + '/sublist.html'
	},
	subdetails = {
		name: 'subscribers.details',
		parent: subscribers,
		url: '/:id',
		templateUrl: viewsDir + '/subdetails.html',
		controller: 'SubDetailsCtrl'
	},
	subnew = {
		name: 'subscribers.new',
		parent: subscribers,
		url: '/new',
		templateUrl: viewsDir + '/subdetails.html',
		controller: 'SubDetailsCtrl'
	};


	$stateProvider
		.state('home', {
			url: '/home',
			templateUrl: viewsDir + '/home.html',
			controller: 'HomeCtrl'
		})
		.state(subscribers)
		.state(sublist)
		.state(subdetails)
		.state(subnew)
		.state('releases', {
			url: '/releases',
			templateUrl: viewsDir + '/release.html',
			controller: 'ReleaseCtrl',
		})
		.state('releases.list', {
			parent: subscribers,
			url: '',
			templateUrl: viewsDir + '/releaselist.html'
		})
		.state('releases.detail', {
			url: '/:id',
			templateUrl: viewsDir + '/releasedetails.html',
			controller: 'ReleaseDetailCtrl',
			resolve: {
			  release : function(ReleaseService, $stateParams, $q) {
				var deferred = $q.defer();
				ReleaseService.get({id: $stateParams.id}, function(data){
					deferred.resolve(data);
				});
				return deferred.promise;
			  }
			},
		})
		.state('releases.new-artist', {
			url: '/new/release/:artist',
			templateUrl: viewsDir + '/releasedetails.html',
			controller: 'ReleaseDetailCtrl',
			resolve: { release: function(ReleaseService, $q) { return {}; }},
		})
		.state('releases.new', {
			url: '/new/release',
			templateUrl: viewsDir + '/releasedetails.html',
			controller: 'ReleaseDetailCtrl',
			resolve: { release: function(ReleaseService, $q) { return {}; }},
		})
		.state('contacts', {
			url: '/contacts',
			templateUrl: viewsDir + '/contact.html',
			controller: 'ContactCtrl'
		})
		.state('contacts.details', {
			url: '/:id',
			templateUrl: viewsDir + '/contactdetails.html',
			controller: 'ContactDetailsCtrl',
			resolve: {
			    contact : function(ContactService, $stateParams, $q) {
			        var deferred = $q.defer();
			        ContactService.get({id: $stateParams.id}, function(data){
			            deferred.resolve(data);
			        });
			    return deferred.promise;
				}
			}
		})
		.state('contacts.new', {
			url: '/new/contact',
			templateUrl: viewsDir + '/contactdetails.html',
			controller: 'ContactDetailsCtrl',
			resolve: { contact: function() { return {}; }}
		})

		$locationProvider.html5Mode(true);
  });




zed2app.directive('ngUppercaseInput', function () {
	return {

		require: 'ngModel',
		link: function (scope, element, attrs, modelCtrl) {
			var capitalize = function ($viewValue) {
				if ($viewValue) {
					var capitalized = $viewValue.toUpperCase();
					if (capitalized !== $viewValue) {
						modelCtrl.$setViewValue(capitalized);
						modelCtrl.$render();
					}
					return capitalized;
				}

			}
			modelCtrl.$parsers.push(capitalize);
			capitalize(scope[attrs.ngModel]); // capitalize initial value
		}
	};
})

.directive('ngUppercaseInput2', function() {
	return {
		require: 'ngModel',
		link: function(scope, element, attrs, modelCtrl) {
			var capitalize = function($viewValue) {
				var initCursor = element[0].selectionStart;
				if ($viewValue) {
					var capitalized = $viewValue.toUpperCase();
					if (capitalized !== $viewValue) {
						modelCtrl.$setViewValue(capitalized);
						modelCtrl.$render();
					}
					element[0].selectionStart = element[0].selectionEnd = initCursor;
					return capitalized;
				}

			}
			modelCtrl.$parsers.push(capitalize);
			capitalize(scope[attrs.ngModel]); // capitalize initial value
		}
	};
})

var apiSrc = 'api/v1';

zed2app.factory('SubService', function ($resource) {
		return $resource(apiSrc + '/subscribers/:id', { id: '@subnumber' }, { update: { method: 'PUT' } })
})
.factory('ReleaseService', function($resource) {
		return $resource(apiSrc + '/releases/:id', { id: '@id' }, { update: { method: 'PUT' } });
})
.factory('ContactService', function($resource) {
	return $resource(apiSrc + '/contacts/:id', { id: '@contact_no' }, { update: { method: 'PUT' }})
})
.factory('SubtypesService', function ($resource) {
    return $resource(apiSrc + '/subtypes/:id', { id: '@id' }, { update: { method: 'PUT' } })
})
.factory('ProgramService', function ($resource) {
    return $resource(apiSrc + '/programs/:id', { id: '@id' }, { update: { method: 'PUT' } })
})
.factory('GenresService', function($resource) {
	return $resource(apiSrc + '/genres/:id', { id: '@genre_id' }, { update: { method: 'PUT'} })
})
.factory('ThemesService', function($resource) {
	return $resource(apiSrc + '/themes/:id', { id: '@theme_id' }, { update: { method: 'PUT'} })
})
.factory('GenresNewService', function($resource) {
	return $resource(apiSrc + '/genresnew/:id', { id: '@id' }, { update: { method: 'PUT' } })
})
.factory('DepartmentsService', function($resource) {
	return $resource(apiSrc + '/departments/:id', { id: '@department_no' }, { update: { method: 'PUT' }	})
})
.factory('InterestsService', function($resource) {
	return $resource(apiSrc + '/interests/:id', { id: '@interest_no' }, { update: { method: 'PUT' } })
})

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

'use strict';

zed2app.controller('ContactDetailsCtrl', function ($rootScope, $scope, $http, $location, $stateParams, ContactService, DepartmentsService, InterestsService, contact) {

	$scope.alerts = [];
	$scope.consuggest = [];
	$scope.submitType = ($location.path() == '/contacts/new/contact') ? 'Add Contact' : 'Update';
	var apiSrc = '/api/v1';

	if ($stateParams.id) {
			$scope.contact = contact;
	} else {
			$scope.contact = new ContactService();
	}

	// $scope.suburbsuggest = function(suburbName) {
	//     return $http.get(apiSrc + '/suburbsuggest/' + suburbName).then(function(response) {
	//         return limitToFilter(response.data, 15);

	//     });
	// };

	// $scope.conCheck = function(org_nm) {
	//     $http.get(apiSrc + '/concheck/' + org_nm).then(function(response) {
	//         $scope.consuggest = response.data;
	//     });
	// };

	// $scope.departments = DepartmentsService.query();
	// $scope.interests = InterestsService.query();

	$scope.saveContact = function() {

			if ($stateParams.id) {
					//update

					$scope.contact.$update({
							id: $stateParams.id
					}, function success(response) {
							if ($scope.alerts.length > 0) {
									$scope.alerts.splice(0, 1);
							}
							$scope.alerts.push({
									msg: 'Contact ' + $stateParams.id + ' Updated!'
							});

							$scope.contact = ContactService.get({
									id: $stateParams.id
							});
							$anchorScroll();

					}, function err() {
							console.log('Couldnt update!');
					});

			} else {
					//insert

					/*$scope.contact.$save();
					alert('Contact added');
					$location.path('/contacts');*/
					$scope.contact.$save(function() {
							alert('Contact added');
							$location.path('/contacts/' + $scope.contact.contact_no);
					});

					// $http.post(apiSrc + '/contacts/', $scope.contact).success(function(data) {
					//     var matches = data.match(/int\((\d+)\)/);
					//     $scope.contact = ContactService.get({
					//         id: matches[1]
					//     }, function() {
					//         alert('Contact added.');
					//         $location.path('/contacts/' + $scope.contact.contact_no);
					//     });

					// });
			}
	};



	$scope.deleteContact = function() {
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
									$scope.contact.$delete({
											id: $stateParams.id
									}, function() {

											alert('Record deleted');
											$location.path('/contacts');

									});
							}
					});
	};


	$scope.closeAlert = function(index) {
			$scope.alerts.splice(index, 1);
	};

	$scope.onSuburbChange = function($item, $model, $label) {

			//item = suburb object, model = val (id), label = name

			$scope.contact.postcode = $item.postcode;
			$scope.contact.state = $item.state;
	};
});

'use strict';

zed2app.controller('HomeCtrl', function () {

});

'use strict';

zed2app.controller('ReleaseCtrl', function($rootScope, $scope, $http, $location, $stateParams, ReleaseService, GenresService, ThemesService, limitToFilter, $filter) {

	$scope.releaseSearchFormData = {};
	var apiSrc = '/api/v1';

	// if ($rootScope.releaseParams) {
	// 	$scope.releases = ReleaseService.query($rootScope.releaseParams, function() {
	// 		//set order of display
	// 		$scope.predicate = 'release_year';
	// 		$scope.releaseSearchFormData = $rootScope.releaseParams;
	// 		//delete $rootScope.releaseParams;
	// 	});
	// }

	$scope.ausnz = ["A", "NZ"];
	$scope.format = ["CD", "DIGITAL", "VINYL"];
	$scope.extendedFormats = [{
		format_srch: 'CD',
		format_desc: 'CD'
	}, {
		format_srch: 'DIGITAL',
		format_desc: 'DIGITAL'
	}, {
		format_srch: 'LP',
		format_desc: 'VINYL LP'
	}, {
		format_srch: '7"',
		format_desc: 'VINYL 7"'
	}];

	//$scope.genres = GenresService.query();
	// $scope.themes = ThemesService.query();




	$scope.artistsuggest = function (name) {
			return $http.get(apiSrc + '/artistsuggest/' + name).then(function (response) {
					return response.data;
			});
	};

	$scope.titlesuggest = function(title) {
		return $http.get(apiSrc + '/titlesuggest/' + title).then(function(response) {
			return limitToFilter(response.data, 15);
		});
	};

	$scope.labelsuggest = function(label) {
		return $http.get(apiSrc + '/labelsuggest/' + label).then(function(response) {
			return limitToFilter(response.data, 15);
		});
	};

	$scope.aprasuggest = function(apra) {
		return $http.get(apiSrc + '/aprasuggest/' + apra).then(function(response) {
			return limitToFilter(response.data, 15);
		});
	};

	// $scope.hometownsuggest = function(hometown) {
	// 	return $http.get(apiSrc + '/hometownsuggest/' + hometown).then(function(response) {
	// 		return limitToFilter(response.data, 15);
	// 	});
	// };

	// $scope.countrysuggest = function(country) {
	// 	return $http.get(apiSrc + '/countrysuggest/' + country).then(function(response) {
	// 		return limitToFilter(response.data, 15);
	// 	});
	// };



	$scope.search = function($element) {


		if ($scope.releaseSearchForm.$dirty === true) {
			var params = $scope.releaseSearchFormData;

			$scope.releases = ReleaseService.query(params, function(u, getResponseHeaders) {

				//set order of display
				$scope.predicate = 'release_year';
				$scope.artistname = $stateParams.name;
				$rootScope.releaseParams = params;

			});
		} else {
			console.log('no search shit!');

		}
	};

	$scope.clearForm = function() {
		$location.path('/releases');
		$scope.releaseSearchFormData = {};
		$scope.releaseSearchForm.$setPristine();
		delete $rootScope.releaseParams;
		$scope.releases = {};
	};


	//add new
	$scope.addNew = function() {
		if ($scope.releaseSearchFormData.artist_nm) {
			$location.path('/releases/new/release/' + $scope.releaseSearchFormData.artist_nm);
		} else {
			$location.path('/releases/new/release');
		}
	};

	$scope.convertDate = function(date) {
		console.log(date);
		$scope.cDate = $filter('date')(new Date(date), 'y-MM-dd');
	};

});

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

'use strict';

angular.module('zed2App')
  .controller('TestCtrl', function ($scope, $http) {
    $http.get('/api/awesomeThings').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
    });
  });
