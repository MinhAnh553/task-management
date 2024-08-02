const md5 = require('md5');

const userModel = require('../models/userModel');

module.exports.getUserByEmail = async (email) => {
    try {
        const user = await userModel.findOne({
            email: email,
            deleted: false,
        });

        return user;
    } catch (error) {
        throw error;
    }
};

module.exports.getAllUser = async () => {
    try {
        const users = await userModel
            .find({
                deleted: false,
            })
            .select('-password -token');

        return users;
    } catch (error) {
        throw error;
    }
};

module.exports.createNew = async (reqBody) => {
    try {
        reqBody.password = md5(reqBody.password);

        const newUser = new userModel(reqBody);
        await newUser.save();

        return newUser;
    } catch (error) {
        throw error;
    }
};

module.exports.login = async (reqBody) => {
    try {
        const { email, password } = reqBody;
        const userLogin = await userModel.findOne({
            email: email,
            password: md5(password),
            status: 'active',
            deleted: false,
        });

        return userLogin;
    } catch (error) {
        throw error;
    }
};
