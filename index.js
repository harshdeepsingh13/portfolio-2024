const dotenv = require('dotenv')
dotenv.config({path: "./.env"});

const express = require('express');
const cors = require('cors');
const mongooseConnection = require('./config/mongoose.js');
const apiRoutes = require("./api");

const app = express();
const PORT = process.env.PORT || 8081;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//API routes
app.use("/api", apiRoutes)

//mongodb connection
mongooseConnection();

app.listen(PORT, () => console.log(`Server is running on ${PORT}`))
