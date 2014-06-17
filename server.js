'use strict';

var express = require('express'),
	routing = require('resource-routing'),
	orm = require('orm'),
	async = require('async'),
	_ = require('lodash'),
	path = require('path'),
	flash = require('connect-flash'),
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	db_connection = require('./lib/config/db');

var app = express();


// Express Configuration =====================================================
app.configure('development', function(){
	app.use(require('connect-livereload')());
	app.use(express.static(path.join(__dirname, '.tmp')));
	app.use(express.static(path.join(__dirname, 'app')));
	app.use(express.errorHandler());
	app.set('views', __dirname + '/app/views');
	//routing.expose_routing_table(app);
});

app.configure('production', function(){
	app.use(express.favicon(path.join(__dirname, 'public', 'favicon.ico')));
	app.use(express.static(path.join(__dirname, 'public')));
	app.set('views', __dirname + '/views');
});

app.configure(function(){
	app.engine('html', require('ejs').renderFile);
	app.set('view engine', 'html');
	app.set('controllers', __dirname + '/lib/controllers');

	app.use(express.logger('dev'));
	app.use(express.cookieParser());
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.session({ secret: 'eat the peach' }));
	app.use(flash());
	app.use(passport.initialize());
	app.use(passport.session());
	//orm2

	orm.settings.set('connection.debug', true);
	app.use(orm.express(db_connection, {
		define: function (db, models, next) {
			db.load('./lib/models/', function (err) {
				if (err) {
					console.log(err);
				}
				// assign models
				models.subscriber = db.models.tbl_subscribers;
				models.contact = db.models.tbl_contacts;
				models.release = db.models.tbl_musiclibrary;
				models.user = db.models.users;
				models.suburbs = db.models.suburbs;
				models.genres = db.models.genres;

				models.subtypes = db.models.tbl_subtype;
				models.programs = db.models.tbl_program;

				next();
			});

			//TODO: move model defs into separate files
			// db.load('./lib/models/subscriber.js', function(err){
			// 	if (err) {
			// 		//TODO: improve error handling in the middleware
			// 		var error = 'Table not found!';
			// 		console.log(error);
			// 		next(new Error('Table not found!'));
			// 	}
			// 	models.subscriber = db.models.tbl_subscribers;
			// 	next();
			// });
		}
	}));
	app.use(app.router);
	app.use(function(err, req, res, next) {
		res.status(500);
		res.render('error', { error: err });
	});
});

require('./lib/config/passport.js')(passport);

// Controllers ================================================================

var controller_dir = path.resolve('./lib/controllers'),
		util_controller = require('./lib/controllers/main_controller.js');

// routes ======================================================================
require('./lib/routes.js')(app, passport, controller_dir, util_controller, orm, routing);

// Start server ================================================================
var port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log('Express server listening on port %d in %s mode', port, app.get('env'));
});



