const express = require('express');
const userValidation = require('../../../validations/userValidation');
const userController = require('../../../controllers/userController');
const authMiddleware = require('../../../middlewares/authMiddleware');

const Router = express.Router();

Router.route('/register').post(
    userValidation.register,
    userController.register
);

Router.route('/login').post(userValidation.login, userController.login);

Router.route('/list').get(authMiddleware.isAuthorized, userController.listUser);

module.exports = Router;
