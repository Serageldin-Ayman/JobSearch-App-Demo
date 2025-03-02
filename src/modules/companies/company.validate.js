import Joi from 'joi';

// Validation schema for adding a company
export const addCompanyValidation = Joi.object({
    companyName: Joi.string().required().trim().messages({
        'string.empty': 'Company name is required',
        'any.required': 'Company name is required',
    }),
    companyEmail: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'string.empty': 'Company email is required',
        'any.required': 'Company email is required',
    }),
    description: Joi.string().required().messages({
        'string.empty': 'Description is required',
        'any.required': 'Description is required',
    }),
    industry: Joi.string().required().messages({
        'string.empty': 'Industry is required',
        'any.required': 'Industry is required',
    }),
    address: Joi.string().required().messages({
        'string.empty': 'Address is required',
        'any.required': 'Address is required',
    }),
    numberOfEmployees: Joi.number().min(11).max(20).required().messages({
        'number.min': 'Number of employees must be at least 11',
        'number.max': 'Number of employees must not exceed 20',
        'any.required': 'Number of employees is required',
    }),
    createdBy: Joi.string().required().messages({
        'string.empty': 'Created by is required',
        'any.required': 'Created by is required',
    }),
});

// Validation schema for updating a company
export const updateCompanyValidation = Joi.object({
    companyName: Joi.string().trim().optional(),
    companyEmail: Joi.string().email().optional().messages({
        'string.email': 'Please provide a valid email address',
    }),
    description: Joi.string().optional(),
    industry: Joi.string().optional(),
    address: Joi.string().optional(),
    numberOfEmployees: Joi.number().min(11).max(20).optional().messages({
        'number.min': 'Number of employees must be at least 11',
        'number.max': 'Number of employees must not exceed 20',
    }),
});

// Validation schema for searching a company by name
export const searchCompanyValidation = Joi.object({
    name: Joi.string().required().messages({
        'string.empty': 'Search query is required',
        'any.required': 'Search query is required',
    }),
});

// Validation schema for uploading a company logo or cover picture
export const uploadCompanyImageValidation = Joi.object({
    file: Joi.object().required().messages({
        'any.required': 'File is required',
    }),
});