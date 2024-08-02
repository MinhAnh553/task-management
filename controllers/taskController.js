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

// [PATCH] /api/v1/task/change-status/:idTask
module.exports.changeStatusTask = async (req, res) => {
    try {
        const idTask = req.params.idTask;

        await taskModel.updateOne(
            {
                _id: idTask,
            },
            {
                status: req.body.status,
            }
        );

        res.json({
            code: 200,
            message: 'Success',
        });
    } catch (error) {
        res.json({
            code: 404,
            message: 'Not Found!',
        });
    }
};

// [PATCH] /api/v1/task/change-multi
module.exports.changeMultiTask = async (req, res) => {
    try {
        const { ids, key, value } = req.body;

        switch (key) {
            case 'status':
                await taskModel.updateMany(
                    {
                        _id: { $in: ids },
                    },
                    {
                        [key]: value,
                    }
                );

                res.json({
                    code: 200,
                    message: 'Success',
                });
                break;

            case 'delete':
                await taskModel.updateMany(
                    {
                        _id: { $in: ids },
                    },
                    {
                        deleted: true,
                        deletedAt: new Date(),
                    }
                );

                res.json({
                    code: 200,
                    message: 'Success',
                });
                break;

            default:
                res.json({
                    code: 404,
                    message: 'Not Found!',
                });
                break;
        }
    } catch (error) {
        res.json({
            code: 404,
            message: 'Not Found!',
        });
    }
};

// [POST] /api/v1/task/create
module.exports.createTask = async (req, res) => {
    try {
        req.body.createdBy = req.jwtDecoded.id;
        const task = new taskModel(req.body);
        const data = await task.save();

        res.json({
            code: 200,
            message: 'Success',
            data: data,
        });
    } catch (error) {
        res.json({
            code: 404,
            message: 'Not Found!',
        });
    }
};

// [PATCH] /api/v1/task/edit/:idTask
module.exports.editTask = async (req, res) => {
    try {
        const id = req.params.idTask;
        const data = req.body;

        await taskModel.updateOne(
            {
                _id: id,
            },
            data
        );

        res.json({
            code: 200,
            message: 'Success',
        });
    } catch (error) {
        res.json({
            code: 404,
            message: 'Not Found!',
        });
    }
};

// [DELETE] /api/v1/task/delete/:idTask
module.exports.deleteTask = async (req, res) => {
    try {
        const id = req.params.idTask;

        await taskModel.updateOne(
            {
                _id: id,
            },
            {
                deleted: true,
                deletedAt: new Date(),
            }
        );

        res.json({
            code: 200,
            message: 'Success',
        });
    } catch (error) {
        res.json({
            code: 404,
            message: 'Not Found!',
        });
    }
};
