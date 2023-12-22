const mongoose = require("mongoose");

module.exports = mongoose.Schema(
	{
		user: {
			type: String,
			required: true,
			index: true
		},
		company: {
			type: String
		},
		position: {
			type: String
		},
		startDate: {
			type: Date
		},
		endDate: {
			type: Date
		},
		isPresent: {
			type: Boolean
		},
		responsibilities: {
			type: String
		},
		location: {
			type: String
		}
	},
	{
		timestamps: true
	}
);
