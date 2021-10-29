const { body } = require("express-validator");
const Users = require("../Schemas/Users");

const validator = {};

validator.userAddValidator = [
  body("firstname")
    .isLength({ min: 1, max: 16 })
    .withMessage("Invalid firstname")
    .trim(),
  body("lastname")
    .isLength({ min: 3, max: 16 })
    .withMessage("Invalid lastname")
    .trim(),
  body("email")
    .isEmail()
    .withMessage("Invalid email")
    .custom(async (email) => {
      const userEmail = await Users.findOne({ email });
      if (userEmail) {
        return Promise.reject("Email already exist!");
      }
    })
    .trim(),
  body("username")
    .isLength({ min: 4, max: 8 })
    .withMessage("Invalid username")
    .custom(async (username) => {
      const userName = await Users.findOne({ username });
      if (userName) {
        return Promise.reject("Username already exist!");
      }
    })
    .trim(),
  body("role").custom((roule) => {
    const defaultRoule = ["admin", "manager", "srDev", "jrDev", "designer"];
    if (defaultRoule.indexOf(roule) === -1) {
      return Promise.reject("Assaign a roule");
    } else {
      //without else, it's not working
      return roule;
    }
  }),
  body("status").custom((statsu) => {
    const defaultStatus = ["active", "suspended"];
    if (defaultStatus.indexOf(statsu) === -1) {
      return Promise.reject("set account status");
    } else {
      //without else, it's not working
      return statsu;
    }
  }),
];

module.exports = validator;
