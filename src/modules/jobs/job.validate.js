import Joi from 'joi';

// Validation schema for adding a job
export const addJobValidation = Joi.object({
    title: Joi.string().required().trim().messages({
        'string.empty': 'Job title is required',
        'any.required': 'Job title is required',
    }),
    description: Joi.string().required().messages({
        'string.empty': 'Job description is required',
        'any.required': 'Job description is required',
    }),
    requirements: Joi.string().required().messages({
        'string.empty': 'Job requirements are required',
        'any.required': 'Job requirements are required',
    }),
    location: Joi.string().required().messages({
        'string.empty': 'Job location is required',
        'any.required': 'Job location is required',
    }),
    salary: Joi.number().required().messages({
        'number.base': 'Salary must be a number',
        'any.required': 'Salary is required',
    }),
    workingTime: Joi.string().valid('Full-time', 'Part-time', 'Contract', 'Internship').required().messages({
        'any.only': 'Working time must be one of Full-time, Part-time, Contract, or Internship',
        'any.required': 'Working time is required',
    }),
    seniorityLevel: Joi.string().valid('Junior', 'Mid-level', 'Senior', 'Lead').required().messages({
        'any.only': 'Seniority level must be one of Junior, Mid-level, Senior, or Lead',
        'any.required': 'Seniority level is required',
    }),
    technicalSkills: Joi.array().items(Joi.string()).required().messages({
        'array.base': 'Technical skills must be an array',
        'any.required': 'Technical skills are required',
    }),
});

// Validation schema for updating a job
export const updateJobValidation = Joi.object({
    title: Joi.string().trim().optional(),
    description: Joi.string().optional(),
    requirements: Joi.string().optional(),
    location: Joi.string().optional(),
    salary: Joi.number().optional().messages({
        'number.base': 'Salary must be a number',
    }),
    workingTime: Joi.string().valid('Full-time', 'Part-time', 'Contract', 'Internship').optional().messages({
        'any.only': 'Working time must be one of Full-time, Part-time, Contract, or Internship',
    }),
    seniorityLevel: Joi.string().valid('Junior', 'Mid-level', 'Senior', 'Lead').optional().messages({
        'any.only': 'Seniority level must be one of Junior, Mid-level, Senior, or Lead',
    }),
    technicalSkills: Joi.array().items(Joi.string()).optional().messages({
        'array.base': 'Technical skills must be an array',
    }),
});

// Validation schema for applying to a job
export const applyToJobValidation = Joi.object({
    // No body required for applying to a job (user ID is taken from the token)
});

// Validation schema for accepting or rejecting an applicant
export const acceptOrRejectApplicantValidation = Joi.object({
    status: Joi.string().valid('accepted', 'rejected').required().messages({
        'any.only': 'Status must be either accepted or rejected',
        'any.required': 'Status is required',
    }),
});

// Validation schema for searching jobs with filters
export const searchJobsValidation = Joi.object({
    workingTime: Joi.string().valid('Full-time', 'Part-time', 'Contract', 'Internship').optional().messages({
        'any.only': 'Working time must be one of Full-time, Part-time, Contract, or Internship',
    }),
    jobLocation: Joi.string().optional(),
    seniorityLevel: Joi.string().valid('Junior', 'Mid-level', 'Senior', 'Lead').optional().messages({
        'any.only': 'Seniority level must be one of Junior, Mid-level, Senior, or Lead',
    }),
    jobTitle: Joi.string().optional(),
    technicalSkills: Joi.string().optional(), // Comma-separated string
    page: Joi.number().min(1).optional().messages({
        'number.min': 'Page must be at least 1',
    }),
    limit: Joi.number().min(1).optional().messages({
        'number.min': 'Limit must be at least 1',
    }),
    sort: Joi.string().optional(),
});