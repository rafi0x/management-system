const { body } = require("express-validator");

const addTaskValidator = [
  body("title")
    .not()
    .isEmpty()
    .withMessage("title can't be empty")
    .trim()
    .escape(),
  body("description")
    .isLength({ min: 10 })
    .withMessage("Write description")
    .trim()
    .escape(),
  body("users").isMongoId().withMessage("select a user"),
  body("expDate").isDate().withMessage("set expire date"),
  body("expTime").not().isEmpty().withMessage("set expire time"),
];

module.exports = addTaskValidator;
