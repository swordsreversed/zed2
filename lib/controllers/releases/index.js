var orm = require('orm'),
		_ = require('lodash');

module.exports = {
	options: {
		name: 'api/releases', // Overrides module name (folder name)
		id: 'release'
	},
	index: function(req, res){
		req.models.release.find({artist_nm: orm.like(req.query.artist_nm + '%') })
		.order('library_no').run(function (err, releases) {
			(!err) ? res.json(releases) :	res.send(err);
			console.log('releases found: %d', releases.length);
		});
	},
	show: function(req, res) {
		req.models.release.get(req.params.release, function (err, release) {
			console.log(req.params.release);
			(!err) ? res.json(release) :	res.send(err);
		});
	},
	update: function(req, res) {
		req.models.release.get(req.params.release, function (err, release) {
			if (!err) {
				release.save(req.body, function (err) {
					(!err) ? res.json(release) :	res.send(err);
				});
			} else {
				res.send(err);
			}
		});
	},
	create: function(req, res) {
		console.log(req.body);
		req.models.release.create(req.body, function(err, release) {
			(!err) ? res.json(release) :	console.log(err);
		});
	}

};

