var orm = require('orm'),
		_ = require('lodash');

module.exports = {
	index: function(req, res){
		console.log(req.query);
		req.models.contact.find({org_nm: orm.like(req.query.org_nm + '%') })
		.order('contact_no').run(function (err, contacts) {
			console.log('contacts found: %d', contacts.length);
			(!err) ? res.json(contacts) :	console.log(err);
		});
	},
	show: function(req, res) {
		req.models.contact.get(req.params.id, function (err, contact) {
			(!err) ? res.json(contact) : console.log(err);
		});
	},
	update: function(req, res) {

		req.models.contact.get(req.params.id, function (err, contact) {
			if (!err) {
				contact.save(req.body, function (err) {
					(!err) ? res.json(contact) :	console.log(err);
				});
			} else {
				res.send(err);
			}
		});
	},
	create: function(req, res) {
		console.log(req.body);
		req.models.contact.create(req.body, function(err, contact) {
			(!err) ? res.json(contact) :	console.log(err);
		});
	},
	destroy: function(req, res) {
		res.send('gone');
	}
}
