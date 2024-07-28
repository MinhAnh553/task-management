const taskModel = require('../models/taskModel');
const paginationHelper = require('../helpers/paginationHelper');
const searchHelper = require('../helpers/searchHelper');

// [GET] /api/v1/task
module.exports.getAllTasks = async (req, res) => {
    try {
        const find = {
            deleted: false,
        };

        const sort = {
            key: 'title',
            value: 'asc',
        };

        const objectPagination = {
            currentPage: 1,
            limitRecord: 2,
        };

        if (req.query.status) {
            find.status = req.query.status;
        }

        if (req.query.keyword) {
            find.title = searchHelper(req.query);
        }

        if (req.query.sortKey && req.query.sortValue) {
            sort.key = req.query.sortKey;
            sort.value = req.query.sortValue;
        }

        const countTask = await taskModel.countDocuments({
            deleted: false,
        });

        const pagination = paginationHelper(objectPagination, req, countTask);

        const tasks = await taskModel
            .find(find)
            .sort({
                [sort.key]: sort.value,
            })
            .limit(pagination.limitRecord)
            .skip(pagination.skip);

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
