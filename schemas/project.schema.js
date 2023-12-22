const mongoose  = require( "mongoose");

module.exports = mongoose.Schema(
	{
		user:{
			type: String,
			required: true,
			index: true
		},
		name: {
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
		summary: {
			type: String
		},
		link: {
			type: String
		},
		technologyStack: {
			type: Array
		},
		website: {
			type: String
		}
	},
	{
		timestamps: true
	}
);
