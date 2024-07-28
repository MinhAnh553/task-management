const taskModel = require('../models/taskModel');

// [GET] /api/v1/task
module.exports.getAllTasks = async (req, res) => {
    try {
        let find = {
            deleted: false,
        };

        if (req.query.status) {
            find.status = req.query.status;
        }

        const tasks = await taskModel.find(find);
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
