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



