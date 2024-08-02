const md5 = require('md5');
const { StatusCodes } = require('http-status-codes');
const ms = require('ms');

const userModel = require('../models/userModel');
const JwtProvider = require('../providers/JwtProvider');

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

            // Jwt
            const userInfo = {
                id: user._id,
                email: user.email,
                fullName: user.fullName,
            };
            const accessToken = await JwtProvider.generateToken(
                userInfo,
                process.env.ACCESS_TOKEN_SECRET_SIGNATURE,
                // '1h'
                '14 days'
            );

            const refreshToken = await JwtProvider.generateToken(
                userInfo,
                process.env.REFRESH_TOKEN_SECRET_SIGNATURE,
                '14 days'
            );

            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: ms('14 days'),
            });
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: ms('14 days'),
            });

            res.status(StatusCodes.OK).json({
                message: 'Tạo tài khoản thành công!',
                userInfo,
                accessToken,
                refreshToken,
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

module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({
            email: email,
            password: md5(password),
            status: 'active',
            deleted: false,
        });

        if (!user) {
            res.status(StatusCodes.FORBIDDEN).json({
                message: 'Email hoặc mật khẩu không đúng!',
            });
            return;
        }

        // Xử lý bằng Jwt
        const userInfo = {
            id: user._id,
            email: user.email,
            fullName: user.fullName,
        };
        const accessToken = await JwtProvider.generateToken(
            userInfo,
            process.env.ACCESS_TOKEN_SECRET_SIGNATURE,
            // '1h'
            '14 days'
        );
        const refreshToken = await JwtProvider.generateToken(
            userInfo,
            process.env.REFRESH_TOKEN_SECRET_SIGNATURE,
            '14 days'
        );

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: ms('14 days'),
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: ms('14 days'),
        });

        res.status(StatusCodes.OK).json({
            ...userInfo,
            accessToken,
            refreshToken,
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
};

module.exports.refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        const refreshTokenDecoded = await JwtProvider.verifyToken(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET_SIGNATURE
        );
        const userInfo = {
            id: refreshTokenDecoded.id,
            email: refreshTokenDecoded.email,
            fullName: refreshTokenDecoded.fullName,
        };
        const accessToken = await JwtProvider.generateToken(
            userInfo,
            process.env.ACCESS_TOKEN_SECRET_SIGNATURE,
            '1h'
        );

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: ms('14 days'),
        });
        res.status(StatusCodes.OK).json({
            accessToken,
        });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Refresh accessToken failed!',
        });
    }
};

module.exports.listUser = async (req, res) => {
    try {
        const users = await userModel
            .find({
                deleted: false,
            })
            .select('-password -token ');

        res.status(StatusCodes.OK).json({
            message: 'Thành công',
            listUser: users,
        });
    } catch (error) {
        res.status(StatusCodes.NOT_FOUND);
    }
};
