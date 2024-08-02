const { StatusCodes } = require('http-status-codes');

const searchHelper = require('../helpers/searchHelper');
const taskService = require('../services/taskService');

// [GET] /api/v1/task
module.exports.getAllTask = async (req, res) => {
    try {
        const tasks = await taskService.getAllTask(req);

        res.status(StatusCodes.OK).json({
            message: 'Success!',
            tasks,
        });
    } catch (error) {
        res.status(StatusCodes.NOT_FOUND).json({
            message: 'Không tìm thấy!',
        });
    }
};

// [GET] /api/v1/task/detail/:idTask
module.exports.getTaskById = async (req, res) => {
    try {
        const idTask = req.params.idTask;
        const task = await taskService.getTaskById(idTask);

        res.status(StatusCodes.OK).json({
            message: 'Success!',
            task,
        });
    } catch (error) {
        res.status(StatusCodes.NOT_FOUND).json({
            message: 'Không tìm thấy!',
        });
    }
};

// [PATCH] /api/v1/task/change-status/:idTask
module.exports.changeStatusTask = async (req, res) => {
    try {
        const idTask = req.params.idTask;

        req.body = {
            status: req.body.status,
        };

        await taskService.updateOneById(idTask, req.body);

        res.status(StatusCodes.OK).json({
            message: 'Success!',
        });
    } catch (error) {
        res.status(StatusCodes.NOT_FOUND).json({
            message: 'Không tìm thấy!',
        });
    }
};

// [PATCH] /api/v1/task/change-multi
module.exports.changeMultiTask = async (req, res) => {
    try {
        const { ids, key, value } = req.body;

        switch (key) {
            case 'status':
                await taskService.updateManyByIds(ids, key, value);

                res.status(StatusCodes.OK).json({
                    message: 'Success!',
                });
                break;

            case 'delete':
                await taskService.deleteManyByIds(ids);

                res.status(StatusCodes.OK).json({
                    message: 'Success!',
                });
                break;

            default:
                res.status(StatusCodes.NOT_FOUND).json({
                    message: 'Không tìm thấy!',
                });
                break;
        }
    } catch (error) {
        res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
            message: 'Không tìm thấy!',
        });
    }
};

// [POST] /api/v1/task/create
module.exports.createTask = async (req, res) => {
    try {
        const data = await taskService.createNew(req);

        res.status(StatusCodes.OK).json({
            message: 'Success',
            data: data,
        });
    } catch (error) {
        res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
            message: 'Không tìm thấy!',
        });
    }
};

// [PATCH] /api/v1/task/edit/:idTask
module.exports.editTask = async (req, res) => {
    try {
        const id = req.params.idTask;
        const data = req.body;

        const task = await taskService.editTask(id, data);

        res.status(StatusCodes.OK).json({
            message: 'Success',
            task: task,
        });
    } catch (error) {
        res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
            message: 'Không tìm thấy!',
        });
    }
};

// [DELETE] /api/v1/task/delete/:idTask
module.exports.deleteTask = async (req, res) => {
    try {
        const id = req.params.idTask;
        const data = await taskService.deleteTask(id);

        res.status(StatusCodes.OK).json({
            message: 'Success',
        });
    } catch (error) {
        res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
            message: 'Không tìm thấy!',
        });
    }
};
