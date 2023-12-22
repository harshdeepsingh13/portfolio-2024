const mongoose = require("mongoose");
const ImageSchema = require("./image.schema");
const LocationSchema = require("./location.schema");
const SocialMediaLinksSchema = require("./socialMediaLinks.schema");

module.exports = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            index: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        avatar: {
            type: ImageSchema,
            default: new mongoose.model("image", ImageSchema)
        },
        tags: {
            type: Array
        },
        objective: String,
        contactNumber: {
            type: {
                countryCode: {type: String, required: true},
                contactNumber: {type: String, required: true}
            }
        },
        currentLocation: {
            type: String
        },
        dob: {
            type: Date
        },
        website: {
            type: String
        },
        socialMediaLinks: {
            type: SocialMediaLinksSchema
        }
    },
    {
        timestamps: true
    }
);
