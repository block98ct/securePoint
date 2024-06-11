// Importing necessary functions from the express-validator library
import  { body, validationResult } from 'express-validator'

export const userSighUp = [
    body('email')
        .isEmail().withMessage('Email Must Be Required'),


];
// Validation rules for user login
export const userLogin = [
    body('email')
        .isEmail().normalizeEmail().withMessage('Email Must Be Required'),

    body('password')
        .notEmpty().withMessage('Password must be required')
        .isLength({ min: 8 }).withMessage('Password should be at least 8 characters long')
];

export const subAdminCreateValidate = [
    body('mobileNumber')
        .notEmpty().withMessage('Mobile Number must be required')
        .isLength({ min: 10 }).withMessage('Mobile Number Must Be 10 Digits'),

    body('password')
        .notEmpty().withMessage('Password must be required')
        .isLength({ min: 8 }).withMessage('Password should be at least 8 characters long')
];

export const passwordVallidate = [
    body('password')
        .notEmpty().withMessage('Password must be required')
        .isLength({ min: 8 }).withMessage('Password should be at least 8 characters long'),
    body('confirm_password')
        .notEmpty().withMessage('Password must be required')
        .isLength({ min: 8 }).withMessage('Password should be at least 8 characters long')
]

// Middleware function to handle validation errors
export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({
            msg: errors.errors[0].msg
        });
    }
    next();
};


