'use strict';

var orm = require('orm'),
		_ = require('lodash');

var utilSuggest = function(model, search, searchField) {
	console.log(searchField);
	var query = { searchField: orm.like(search + '%') };
	model.find(query).order(searchField).run(function (err, results) {
		if (!err) {
			return results;
		}
	});
};

module.exports = {

	index: function(req, res){
		req.models.release.find({artist_nm: orm.like(req.query.artist_nm + '%') })
		.order('library_no').run(function (err, releases) {
			(!err) ? res.json(releases) :	res.send(err);
			console.log('releases found: %d', releases.length);
		});
	},
	show: function(req, res) {
		req.models.release.get(req.params.id, function (err, release) {
			(!err) ? res.json(release) : res.send(err);
		});
	},
	update: function(req, res) {
		req.models.release.get(req.params.release, function (err, release) {
			if (!err) {
				release.save(req.body, function (err) {
					(!err) ? res.json(release) : res.send(err);
				});
			} else {
				res.send(err);
			}
		});
	},
	create: function(req, res) {
		console.log(req.body);
		req.models.release.create(req.body, function(err, release) {
			(!err) ? res.json(release) : console.log(err);
		});
	},
	destroy: function(req, res) {

	},
	
	artistsuggest: function(req, res) {
		var query = { artist_nm: orm.like(req.params.name + '%') };
		req.models.release.find(query).order('artist_nm').run(function (err, releases) {
			(!err) ? res.json(releases) : console.log(err);
		});
	},
	titlesuggest: function(req, res) {
		console.log(req.params);
		var query = { title: orm.like(req.params.title + '%') };
		req.models.release.find(query).order('title').run(function (err, releases) {
			(!err) ? res.json(releases) : console.log(err);
		});
	},
	labelsuggest: function(req, res) {
		var query = { label: orm.like(req.params.label + '%') };
		req.models.release.find(query).order('label').run(function (err, releases) {
			(!err) ? res.json(releases) : console.log(err);
		});
	},
	aprasuggest: function(req, res) {
		var apra_code ='apra_code';
		var results = utilSuggest(req.models.release, req.params.apra, apra_code);
		res.json(results);
  // 		var query = { label: orm.like(req.params.label + '%') };
  // 		req.models.release.find(query).order('label').run(function (err, releases) {
		// 	(!err) ? res.json(releases) : console.log(err);
		// });
	},
	
  // 	hometownsuggest: function(req, res) {
  // 		var query = { label: orm.like(req.params.label + '%') };
  // 		req.models.release.find(query).order('label').run(function (err, releases) {
		// 	(!err) ? res.json(releases) : console.log(err);
		// });
  // 	},
  // 	countrysuggest: function(req, res) {
  // 		var query = { label: orm.like(req.params.label + '%') };
  // 		req.models.release.find(query).order('label').run(function (err, releases) {
		// 	(!err) ? res.json(releases) : console.log(err);
		// });
  // 	}

};
