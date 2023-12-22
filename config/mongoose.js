const mongoose = require("mongoose");

let mongodbConnectionURL = process.env.MONGODB_URI;

module.exports = () => {
	mongoose.connect(mongodbConnectionURL, {useNewUrlParser: true, useUnifiedTopology: true})
		.then(r => console.log("Connection with DB is successful."))
		.catch(err => console.error(`Error in connecting with DB - ${err}`));
};
