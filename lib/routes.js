module.exports = function(app, passport, controller_dir, util_controller, orm, routing) {
	var api_prefix = '/api/v1';

	// Server Routes
	app.post('/login',
		passport.authenticate('local', {
			failureRedirect: '/login',
			failureFlash: true }),
				function(req, res) {
					res.redirect('/');
				});

	app.get('/login', util_controller.login);
	app.get('/logout', function(req, res){
		req.logout();
		res.redirect('/login');
	});

 // app.get('api/v1/subsuggest/', function(req, res) {
 //  	req.send(req.params)
 //  	var foo = { sublastname: orm.like(req.params.name + '%') };
 //  	req.models.subscriber.find(
 //  		foo
 //  		).order('subfirstname').run(function (err, subs) {
 //  		//{ age: ORM.gt(18) }
	// 		if (subs) {
	// 			res.json(subs);
	// 		}
	// 	});
 //  });


	// Commented out auth for dev
	//app.all('*', passport.ensureAuthenticated);

	// controllers go in ./lib/controllers/<ctrlr name>/index.js
	// maybe change this to  just files - too many directories
	// app.resource('contacts');
	// app.resource('releases');
	// app.resource('subscribers');
	// app.resource('subtypes');
	// app.resource('programs');
  //custom non-restful routes?

  routing.resources(app, controller_dir, 'contacts', { prefix: api_prefix });
  routing.resources(app, controller_dir, 'releases', { prefix: api_prefix });
  routing.resources(app, controller_dir, 'subscribers', { prefix: api_prefix });
  routing.resources(app, controller_dir, 'genres', { prefix: api_prefix });

  routing.get(app, controller_dir, api_prefix + '/subsuggest/:name', 'subscribers#subsuggest');

  routing.get(app, controller_dir, api_prefix + '/artistsuggest/:name', 'releases#artistsuggest');
  routing.get(app, controller_dir, api_prefix + '/titlesuggest/:title', 'releases#titlesuggest');
  routing.get(app, controller_dir, api_prefix + '/labelsuggest/:label', 'releases#labelsuggest');
  routing.get(app, controller_dir, api_prefix + '/aprasuggest/:apra', 'releases#aprasuggest');

  app.get(api_prefix + '/suburbsuggest/:suburb', function(req, res) {
  	var foo = { suburb: orm.like(req.params.suburb + '%') };
  	req.models.suburbs.find(
  		foo
  		).order('suburb').run(function (err, subs) {
  		//{ age: ORM.gt(18) }
			if (subs) {
				res.json(subs);
			}
		});
  });

	// Angular Routes
	app.get('/partials/*', util_controller.partials);
	app.get('/*', util_controller.index);

}
