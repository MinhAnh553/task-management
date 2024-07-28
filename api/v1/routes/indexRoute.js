const express = require('express');
const Router = express.Router();
const taskRoute = require('./taskRoute');

Router.use('/task', taskRoute);

module.exports = Router;
