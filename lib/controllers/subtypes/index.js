module.exports = {
	options: {
		name: 'api/subtypes', // Overrides module name (adds api to route -- express-resource-new convention)
		id: 'subtypes'
	},
	index: function(req, res){
	  	req.models.subtypes.find(function (err, subtypes) {
			if (!err) {
				res.json(subtypes);
			}
		});
		//res.send('hola');
	},
	show: function(req, res) {
		console.log(req.params);
		res.send('<h1>hullllooo!!!</h1>' + req.params);
	}
}
