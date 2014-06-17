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
