const express = require('express');
const taskController = require('../../../controllers/taskController');
const authMiddleware = require('../../../middlewares/authMiddleware');

const Router = express.Router();

Router.use(authMiddleware.isAuthorized);

Router.route('/').get(taskController.getAllTask);

Router.route('/detail/:idTask').get(taskController.getTaskById);

Router.route('/change-status/:idTask').patch(taskController.changeStatusTask);

Router.route('/change-multi').patch(taskController.changeMultiTask);

Router.route('/create').post(taskController.createTask);

Router.route('/edit/:idTask').patch(taskController.editTask);

Router.route('/delete/:idTask').delete(taskController.deleteTask);

module.exports = Router;
