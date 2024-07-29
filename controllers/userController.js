const md5 = require('md5');
const { StatusCodes } = require('http-status-codes');

const userModel = require('../models/userModel');

module.exports.register = async (req, res) => {
    try {
        const data = req.body;
        const emailExits = await userModel.findOne({
            email: data.email,
            deleted: false,
        });

        if (!emailExits) {
            data.password = md5(data.password);

            const user = new userModel(data);
            await user.save();

            res.status(StatusCodes.OK).json({
                message: 'Tạo tài khoản thành công!',
                token: user.token,
            });
        } else {
            res.status(StatusCodes.CONFLICT).json({
                message: 'Email đã tồn tại!',
            });
        }
    } catch (error) {
        res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
            errors: new Error(error).message,
        });
    }
};
