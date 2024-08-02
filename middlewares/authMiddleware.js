const { StatusCodes } = require('http-status-codes');

const JwtProvider = require('../providers/JwtProvider');

module.exports.isAuthorized = async (req, res, next) => {
    const accessToken = req.cookies?.accessToken;
    if (!accessToken) {
        res.status(StatusCodes.UNAUTHORIZED).json({
            message: 'Unauthorized!',
        });
        return;
    }
    try {
        const accessTokenDecoded = await JwtProvider.verifyToken(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET_SIGNATURE
        );

        req.jwtDecoded = accessTokenDecoded;
        next();
    } catch (error) {
        // accessToken hết hạn
        if (error.message?.includes('jwt expired')) {
            res.status(StatusCodes.GONE).json({
                message: 'Need to refresh accessToken',
            });
            return;
        }

        // accessToken không hợp lệ
        res.status(StatusCodes.UNAUTHORIZED).json({
            message: 'Unauthorized!',
        });
    }
};
