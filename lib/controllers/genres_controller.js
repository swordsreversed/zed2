var orm = require('orm'),
		_ = require('lodash');

module.exports = {
	index: function(req, res){
		req.models.genres.find()
		.order('genre').run(function (err, genres) {
			(!err) ? res.json(genres) : console.log(err);
		});
	},
	show: function(req, res) {
		req.models.genre.get(req.params.id, function (err, genre) {
			(!err) ? res.json(genre) : res.send(err);
		});
	},
	update: function(req, res) {
		req.models.genre.get(req.params.genre, function (err, genre) {
			if (!err) {
				genre.save(req.body, function (err) {
					(!err) ? res.json(genre) : res.send(err);
				});
			} else {
				res.send(err);
			}
		});
	},
	create: function(req, res) {
		console.log(req.body);
		req.models.genre.create(req.body, function(err, genre) {
			(!err) ? res.json(genre) : console.log(err);
		});
	},
	destroy: function(req, res) {

	}
};

