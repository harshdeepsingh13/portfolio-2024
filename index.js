const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const express = require("express");
const cors = require("cors");
const mongooseConnection = require("./config/mongoose.js");
const apiRoutes = require("./api");
const path = require("path");
const userTracker = require("./middlewares/userTracker.js");

const app = express();
const PORT = process.env.PORT || 8081;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//User Tracking email middleware

app.use(userTracker());

//API routes
app.use("/api", apiRoutes);

//mongodb connection
mongooseConnection();

//React forwarding
app.use(express.static("./build"));
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "./build/index.html"));
});

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
