const Joi = require('joi');
const { StatusCodes } = require('http-status-codes');

module.exports.register = async (req, res, next) => {
    const correctCondition = Joi.object({
        fullName: Joi.string().required().min(3).max(20).trim().strict(),
        email: Joi.string()
            .required()
            .email({
                minDomainSegments: 2,
                tlds: { allow: ['com', 'net', 'vn'] },
            }),
        username: Joi.string().required().alphanum().min(3).max(30),
        password: Joi.string()
            .required()
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    });

    try {
        await correctCondition.validateAsync(req.body, {
            abortEarly: false,
        });

        next();
    } catch (error) {
        res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
            errors: new Error(error).message,
        });
    }
};
