const app = require('express').Router();
const userController = require('./User');

app.use("/user", userController)

module.exports = app;
