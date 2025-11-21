const { body, validationResult } = require('express-validator');
const User = require('../Models/UserSchema');

const registerValidator = [
  body('first_name')
    .isString()
    .notEmpty()
    .withMessage('First name is required'),

  body('last_name')
    .isString()
    .notEmpty()
    .withMessage('Last name is required'),

  body('email')
    .isString()
    .isEmail()
    .withMessage('Valid email is required')
    .custom(async (value) => {
      const existingUser = await User.findOne({ email: value });
      if (existingUser) {
        throw new Error('Email is already in use');
      }
      return true;
    }),

  body('password')
    .isString()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const loginValidator = [
  body('email')
    .notEmpty()
    .withMessage('email is required'),

  body('password')
    .notEmpty()
    .withMessage('password is required'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = {
  registerValidator,
  loginValidator,
};
