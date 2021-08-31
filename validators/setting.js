const { body } = require("express-validator");

const profileValidator = [
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
  body("phone").isLength({ min: 11 }).withMessage("Invalid number").trim(),
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
