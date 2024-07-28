const express = require('express');
const taskController = require('../../../controllers/taskController');

const Router = express.Router();

Router.route('/').get(taskController.getAllTasks);

Router.route('/detail/:idTask').get(taskController.getTaskById);

Router.route('/change-status/:idTask').patch(taskController.changeStatusTask);

Router.route('/change-multi').patch(taskController.changeMultiTask);

module.exports = Router;
