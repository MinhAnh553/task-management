const paginationHelper = require('../helpers/paginationHelper');

const taskModel = require('../models/taskModel');

module.exports.countTask = async () => {
    try {
        const count = await taskModel.countDocuments({
            deleted: false,
        });

        return count;
    } catch (error) {
        throw error;
    }
};

module.exports.getTaskById = async (id) => {
    try {
        const task = await taskModel.findOne({
            _id: id,
            deleted: false,
        });

        return task;
    } catch (error) {
        throw error;
    }
};

module.exports.getAllTask = async (req) => {
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

        const countTask = module.exports.countTask;
        const count = await countTask();
        const pagination = paginationHelper(objectPagination, req, count);

        const tasks = await taskModel
            .find(find)
            .sort({
                [sort.key]: sort.value,
            })
            .limit(pagination.limitRecord)
            .skip(pagination.skip);

        return tasks;
    } catch (error) {
        throw error;
    }
};

module.exports.updateOneById = async (id, reqBody) => {
    try {
        const updateTask = await taskModel.updateOne(
            {
                _id: id,
            },
            reqBody
        );

        return updateTask;
    } catch (error) {
        throw error;
    }
};

module.exports.updateManyByIds = async (ids, key, value) => {
    try {
        const updateTasks = await taskModel.updateMany(
            {
                _id: { $in: ids },
            },
            {
                [key]: value,
            }
        );

        return updateTasks;
    } catch (error) {
        throw error;
    }
};

module.exports.deleteManyByIds = async (ids) => {
    try {
        const deleteTasks = await taskModel.updateMany(
            {
                _id: { $in: ids },
            },
            {
                deleted: true,
                deletedAt: new Date(),
            }
        );

        return deleteTasks;
    } catch (error) {
        throw error;
    }
};

module.exports.createNew = async (req) => {
    try {
        req.body.createdBy = req.jwtDecoded.id;
        const task = new taskModel(req.body);
        const data = await task.save();

        return data;
    } catch (error) {
        throw error;
    }
};

module.exports.editTask = async (id, data) => {
    try {
        await taskModel.updateOne(
            {
                _id: id,
            },
            data
        );

        return data;
    } catch (error) {
        throw error;
    }
};

module.exports.deleteTask = async (id) => {
    try {
        const data = await taskModel.updateOne(
            {
                _id: id,
            },
            {
                deleted: true,
                deletedAt: new Date(),
            }
        );

        return data;
    } catch (error) {
        throw error;
    }
};
