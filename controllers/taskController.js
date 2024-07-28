const taskModel = require('../models/taskModel');

// [GET] /api/v1/task
module.exports.getAllTasks = async (req, res) => {
    try {
        const find = {
            deleted: false,
        };

        const sort = {};

        if (req.query.status) {
            find.status = req.query.status;
        }

        if (req.query.sortKey && req.query.sortValue) {
            sort[req.query.sortKey] = req.query.sortValue;
        }

        const tasks = await taskModel.find(find).sort(sort);
        res.json(tasks);
    } catch (error) {
        res.json('Không tìm thấy!');
    }
};

// [GET] /api/v1/task/detail/:idTask
module.exports.getTaskById = async (req, res) => {
    try {
        const idTask = req.params.idTask;
        const task = await taskModel.find({
            _id: idTask,
            deleted: false,
        });
        res.json(task);
    } catch (error) {
        res.json('Không tìm thấy!');
    }
};
