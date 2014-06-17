module.exports = {
	options: {
		name: 'api/programs', // Overrides module name (adds api to route -- express-resource-new convention)
		id: 'programs'
	},
	index: function(req, res){
	  	req.models.programs.find().order('programname').run(function (err, programs) {
			(!err) ? res.json(programs) :	console.log(err);
		});
	},
}
