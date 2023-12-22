const mongoose = require("mongoose");

module.exports = mongoose.Schema(
	{
		user: {
			type: String,
			required: true,
			index: true
		},
		skill: {type: String, required: true},
		efficiency: {type: Number, required: true, min: 1, max: 5}
	},
	{
		timestamps: true
	}
);
