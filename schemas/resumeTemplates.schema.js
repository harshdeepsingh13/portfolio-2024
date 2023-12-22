const mongoose = require("mongoose");

module.exports = mongoose.Schema({
	user: {
		type: String, required: true, index: true
	},
	templateName: {type: String, required: true, default: "Default Template Name"},
	objective: {type: String},
	educationDetails: {type: Array},
	skills: {type: Array},
	workExperience: {type: Array},
	projects: {type: Array},
	trainingsCertifications: {type: Array},
	customSections: {type: Array}
}, {
	timestamps: true
});
