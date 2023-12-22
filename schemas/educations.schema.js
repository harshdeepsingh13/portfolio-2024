const mongoose = require("mongoose");

module.exports = mongoose.Schema(
    {
        user: {
            type: String,
            required: true,
            index: true
        },
        type: {
            type: String,
            enum: ['secondary', 'seniorSecondary', 'graduation', 'postGraduation', "doctorate"],
        },
        instituteName: {
            type: String
        },
        university: {
            type: String
        },
        location: {type: String},
        startDate: {
            type: Date,
            default: Date.now()
        },
        endDate: {
            type: Date
        },
        isPresent: {
            type: Boolean,
            default: false
        },
        course: {
            type: String
        },
        priority: {
            type: Number
        },
        score: {
            type: Number,
            min: 1,
            max: 100
        },
        isPercentage: {
            type: Boolean,
            default: true
        },
        isCGPA: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);
