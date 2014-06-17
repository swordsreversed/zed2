// config/passport.js
var _ = require('lodash'),
		LocalStrategy = require('passport-local').Strategy;

// load up the user model - temp
var my_user = {};

//temp functions


function _getById(id, fn) {
	if (my_user.id === id) {
		return fn(null, my_user);
	} else {
		fn(new Error('User does not exist'));
	}
}

function _validPassword(password, user) {
	// need to unhash password here
	if(password == user.password)
		return true;
};

module.exports = function(passport) {

	// =========================================================================
	// passport session setup ==================================================
	// =========================================================================
	// required for persistent login sessions
	// passport needs ability to serialize and unserialize users out of session


	// used to serialize the user for the session
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	// used to deserialize the user
	passport.deserializeUser(function(id, done) {
		_getById(id, function(err, user) {
			done(err, user);
		});
	});

	passport.use(new LocalStrategy({passReqToCallback : true }, function(req, username, password, done) {
		if (!User) {
	        var User = req.models.user;
	    }

    	User.find({ username: username}, 1 , function (err, user) {
			var user = user[0];

			if (err)
				return done(err);

			if (user) {
				// we cannot yet pass in req.model to deserialize so keep a copy of the user model to send to deserialize model
				my_user = _.clone(user);

				return done(null, user);
			} else {
				return done(null, false, { message: 'Unknown user ' + username });
			}

			// if the user is found but the password is wrong
			//if (!_validPassword(password, user))
			//	return done(null, false, { message: 'Oops! Wrong password.' }); // create the loginMessage and save it to session as flashdata

			// all is well, return successful user

		});

	}));

	passport.ensureAuthenticated = function(req, res, next) {
		if (req.isAuthenticated()) { return next(); }
		res.redirect('/login');
	};

};
