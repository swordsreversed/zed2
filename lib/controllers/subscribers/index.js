var orm = require('orm'),
		_ = require('lodash');

module.exports = {
	options: {
		name: 'api/subscribers', // Overrides module name (folder name)
		id: 'subscriber'
	},
	index: function(req, res){
		if (req.query.subName) {
			var bothNames = req.query.subName.split(' ');
			if (bothNames.length > 1) {
				_.assign(req.query, { 'subfirstname': bothNames[0], 'sublastname': bothNames[1] });
			} else {
				var sublastname = { 'sublastname': orm.like(bothNames[0] + '%') },
						subfirstname = { 'subfirstname': orm.like(bothNames[0] + '%') };
				var foo = [sublastname, subfirstname];
				_.assign(req.query, { 'or': foo  });
			}
			delete req.query.subName;
		}
		req.models.subscriber.find(req.query)
		.order('subnumber').run(function (err, subs) {
			if (!err) {
				console.log('Subs found: %d', subs.length);
				res.json(subs);
			} else {
				res.send(404, 'No subs found.');
			}
		});
	},
	show: function(req, res) {
		req.models.subscriber.get(req.params.subscriber, function (err, sub) {
			if (!err) {
				res.json(sub);
			} else {
				res.send(404, 'Sub in huh not found.');
			}
		});
	},
	update: function(req, res) {
		req.models.subscriber.get(req.params.subscriber, function (err, sub) {
			if (!err) {
				//delete req.body.suburb;

				sub.save(req.body, function (err) {
					if (!err) {
						res.json(sub);
					} else {
						res.send(err);
					}
				});
			} else {
				res.send(err);
			}
		});
	},
	create: function(req, res) {
		console.log(req.body);
		req.models.subscriber.create(req.body, function(err, sub) {
			(!err) ? res.json(sub) :	console.log(err);
		});
	}

};

