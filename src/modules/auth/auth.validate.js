import Joi from 'joi';

// Validation schema for user sign-up
export const signUpValidation = Joi.object({
    firstName: Joi.string().required().trim().messages({
        'string.empty': 'First name is required',
        'any.required': 'First name is required',
    }),
    lastName: Joi.string().required().trim().messages({
        'string.empty': 'Last name is required',
        'any.required': 'Last name is required',
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'string.empty': 'Email is required',
        'any.required': 'Email is required',
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'Password must be at least 6 characters long',
        'string.empty': 'Password is required',
        'any.required': 'Password is required',
    }),
    mobileNumber: Joi.string().required().messages({
        'string.empty': 'Mobile number is required',
        'any.required': 'Mobile number is required',
    }),
    gender: Joi.string().valid('Male', 'Female').required().messages({
        'any.only': 'Gender must be either Male or Female',
        'string.empty': 'Gender is required',
        'any.required': 'Gender is required',
    }),
    DOB: Joi.date().required().messages({
        'date.base': 'Date of birth must be a valid date',
        'any.required': 'Date of birth is required',
    }),
});

// Validation schema for user sign-in
export const signInValidation = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'string.empty': 'Email is required',
        'any.required': 'Email is required',
    }),
    password: Joi.string().required().messages({
        'string.empty': 'Password is required',
        'any.required': 'Password is required',
    }),
});

// Validation schema for confirming OTP
export const confirmOTPValidation = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'string.empty': 'Email is required',
        'any.required': 'Email is required',
    }),
    otp: Joi.string().length(6).required().messages({
        'string.length': 'OTP must be 6 characters long',
        'string.empty': 'OTP is required',
        'any.required': 'OTP is required',
    }),
});

// Validation schema for forget password
export const forgetPasswordValidation = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'string.empty': 'Email is required',
        'any.required': 'Email is required',
    }),
});

// Validation schema for reset password
export const resetPasswordValidation = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'string.empty': 'Email is required',
        'any.required': 'Email is required',
    }),
    otp: Joi.string().length(6).required().messages({
        'string.length': 'OTP must be 6 characters long',
        'string.empty': 'OTP is required',
        'any.required': 'OTP is required',
    }),
    newPassword: Joi.string().min(6).required().messages({
        'string.min': 'Password must be at least 6 characters long',
        'string.empty': 'Password is required',
        'any.required': 'Password is required',
    }),
});

// Validation schema for refresh token
export const refreshTokenValidation = Joi.object({
    refreshToken: Joi.string().required().messages({
        'string.empty': 'Refresh token is required',
        'any.required': 'Refresh token is required',
    }),
});