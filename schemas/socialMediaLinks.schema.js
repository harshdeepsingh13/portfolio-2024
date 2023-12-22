const mongoose = require("mongoose");

module.exports = mongoose.Schema(
	{
		github: {
			type: String
		},
		linkedin: {
			type: String
		},
		facebook: {
			type: String
		},
		instagram: {
			type: String
		}
	},
	{
		timestamps: true
	}
);
