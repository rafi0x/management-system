const { body } = require("express-validator");

const loginValidator = [
  body("username").isAlphanumeric().withMessage("Enter valid username").trim(),
  body("password")
    .isLength({ min: 6, max: 32 })
    .withMessage("Enter valid password")
    .trim(),
  // body('rememberLogin').isBoolean().withMessage('check')
];

module.exports = loginValidator;
