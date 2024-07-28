const express = require('express');
const taskController = require('../../../controllers/taskController');

const Router = express.Router();

Router.route('/').get(taskController.getAllTasks);

Router.route('/detail/:idTask').get(taskController.getTaskById);

module.exports = Router;
