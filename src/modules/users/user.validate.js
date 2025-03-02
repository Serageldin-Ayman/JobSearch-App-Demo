import Joi from 'joi';

export const signUpSchema = {
    body: Joi.object({
        firstName: Joi.string().trim().required(),
        lastName: Joi.string().trim().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
        mobileNumber: Joi.string().required(),
        gender: Joi.string().valid('Male', 'Female').required(),
        DOB: Joi.date().less('now').required(),
        provider: Joi.string().valid('system', 'google').default('system'),
        role: Joi.string().valid('User', 'Admin', 'HR', 'Company Owner').default('User')
    })
};

export const confirmOTPSchema = {
    body: Joi.object({
        email: Joi.string().email().required(),
        otp: Joi.string().required()
    })
};

export const signInSchema = {
    body: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    })
};

export const googleAuthSchema = {
    body: Joi.object({
        idToken: Joi.string().required()
    })
};

export const forgetPasswordSchema = {
    body: Joi.object({
        email: Joi.string().email().required()
    })
};

export const resetPasswordSchema = {
    body: Joi.object({
        email: Joi.string().email().required(),
        newPassword: Joi.string().min(8).required(),
        otp: Joi.string().required()
    })
};

export const refreshTokenSchema = {
    body: Joi.object({
        refreshToken: Joi.string().required()
    })
};

export const updateUserSchema = {
    body: Joi.object({
        firstName: Joi.string().trim().optional(),
        lastName: Joi.string().trim().optional(),
        mobileNumber: Joi.string().optional(),
        DOB: Joi.date().less('now').optional(),
        gender: Joi.string().valid('Male', 'Female').optional()
    })
};

export const updatePasswordSchema = {
    body: Joi.object({
        oldPassword: Joi.string().min(8).required(),
        newPassword: Joi.string().min(8).required()
    })
};