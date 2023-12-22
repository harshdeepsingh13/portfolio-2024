const mongoose = require("mongoose");

module.exports = mongoose.Schema(
	{
		state: {
			type: String
		},
		country: {
			type: String
		}
	},
	{
		timestamps: true
	}
);
