const express = require('express');
const userValidation = require('../../../validations/userValidation');
const userController = require('../../../controllers/userController');

const Router = express.Router();

Router.route('/register').post(
    userValidation.register,
    userController.register
);

Router.route('/login').post(userValidation.login, userController.login);

module.exports = Router;
