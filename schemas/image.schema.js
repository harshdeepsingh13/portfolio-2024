const mongoose = require("mongoose");

module.exports = mongoose.Schema(
	{
		uploadId: {
			type: String,
			required: true,
			default: "defaultAvatar.png"
		}
	},
	{
		timestamps: true
	}
);
