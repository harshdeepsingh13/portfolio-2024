const mongoose = require("mongoose");

module.exports = mongoose.Schema(
    {
        user: {
            type: String,
            required: true,
            index: true
        },
        skills: Array
    },
    {
        timestamps: true
    }
);
