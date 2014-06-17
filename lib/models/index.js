module.exports = function (db, cb) {

	db.define('suburbs', {
		id:Number,
		state:String,
		suburb:String,
		postcode:Number
	});

	db.define('genres', {
		id:Number,
		genre:String
	});

	db.define('tbl_subtype', {
		id    : Number,
		subtypecode   	: String,
		subtypevalue     : Number,
		subtypedescription: String,
		active: Boolean
	});

	db.define('tbl_program', {
		id: Number,
		programdate: String,
		programtime:  String,
		programname: String,
		active: Boolean
	});

	db.define('tbl_contacts', {
		contact_nm: String,
		org_nm:  String,
		org_abn: String,
		website: Boolean,
		street_no:String,
		street_nm:String,
		suburb_nm:String,
		state:String,
		country:String,
		work_ph:String,
		home_ph:String,
		mobile_ph:String,
		email:String,
		other_email:String,
		interests:String,
		notes:String,
		dept_sun:Number,
		interest_sun:Number,
		city:String,
		fax_no:String,
		log:String,
		created_at:Date,
		updated_at:Date,
		entered_dt:Date
	}, {
		id: 'contact_no',
		hooks: {
				beforeSave: function() {
					this.updated_at = new Date();
				},
				beforeCreate: function() {
					this.created_at = new Date();
					this.entered_dt = new Date();
				},
		},
	});

	db.define('tbl_musiclibrary', {
		artist_nm:Number,
		title:String,
		entered_dt:Date,
		cont_female:String,
		cont_ausnz:String,
		cont_local:String,
		apra_code:String,
		cont_genre:Number,
		album_label:String,
		album_origin:String,
		modify_dt:Date,
		modify_user:String,
		release_year:String,
		artist_hometown:String,
		artist_website:String,
		artist_email:String,
		cont_subgenre:Number,
		album_producer:String,
		album_songwriter:String,
		album_record_dt:Date,
		album_record_at:String,
		comments:String,
		interview_dt:Date,
		support_choice:String,
		format_submitted:String,
		format_stored:String,
		media_cond:String,
		status:String,
		release_numgiven:String,
		release_reviewed:String,
		release_returned:String,
		release_rejected:String,
		release_location:String,
		track1_num:String,
		track1_name:String,
		track1_language:Boolean,
		track1_concept:Boolean,
		track1_theme1:Number,
		track1_theme2:Number,
		track2_num:String,
		track2_name:String,
		track2_language:Boolean,
		track2_concept:Boolean,
		track2_theme1:Number,
		track2_theme2:Number,
		track3_num:String,
		track3_name:String,
		track3_language:Boolean,
		track3_concept:Boolean,
		track3_theme1:Number,
		track3_theme2:Number,
		track4_num:String,
		track4_name:String,
		track4_language:Boolean,
		track4_concept:Boolean,
		track4_theme1:Number,
		track4_theme2:Number,
		release_notes:String,
		created_at:Date,
		updated_at:Date

	}, {
		id: 'library_no',
		hooks: {
				beforeSave: function() {
					this.updated_at = new Date();
				},
				beforeCreate: function() {
					this.created_at = new Date();
					this.entered_dt = new Date();
				},
		},
	});

	db.define('tbl_subscribers', {

		subfirstname: String,
		sublastname: String,
		subtype_id: Number,
		subemail: String,
		expirydate: Date,
		paymentdate: Date,
		subaddress1: String,
		subaddress2: String,
		gender: Number,
		suburb_id: Number,
		subhomephone: String,
		submobile: String,
		suburl: String,
		subskill: Number,
		subskilldesc: String,
		subcomment: String,
		receiptnumber: String,
		donation: String,
		radiothonprizeid: Number,
		program_id: Number,
		changeduser: String,
		fl_volunteer: Boolean,
		fl_announcer: Boolean,
		created_at: Date,
		updated_at: Date,
		posted: Boolean,
		merch_posted: Boolean,
		petname: String,
		subartistname: String,
		subbandname: String,
		subbusinessname: String,
		subcommunitygroup: String,
		submusicianname: String
	}, {
		id			: 'subnumber',
		methods: {
				fullName: function () {
					return this.subfirstname + ' ' + this.sublastname;
				}
		},
		hooks: {
				beforeSave: function() {
					this.updated_at = new Date();
				},
				beforeCreate: function() {
					delete this.suburb;
					this.created_at = new Date();
				},
		},
		autoFetch : true
	})
	.hasOne('suburb', db.models.suburbs);
	//.hasOne('subtype', db.models.tbl_subtype);
	//.hasOne('program', db.models.tbl_program);



	db.define('users', {
		username    : String,
		password   	: String,
		role_id     : Number,
	});

	return cb();
};

