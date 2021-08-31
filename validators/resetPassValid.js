const { body } = require("express-validator");

const resetPassValidator = [
  body("password")
    .isLength({ min: 8, max: 20 })
    .withMessage("password must between (8-20) chars")
    .trim(),
  body("repassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      return Promise.reject("password does not match!");
    }
    return value;
  }),
];

module.exports = resetPassValidator;
