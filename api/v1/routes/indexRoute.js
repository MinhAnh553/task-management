const express = require('express');
const Router = express.Router();

const taskRoute = require('./taskRoute');
const userRoute = require('./userRoute');

Router.use('/task', taskRoute);

Router.use('/user', userRoute);

module.exports = Router;
