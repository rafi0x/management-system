// dependencies
const route = require("express").Router();
const { getLogin, postLogin } = require("../controller/auth/auth");
const { getResetPass, postResetPass } = require("../controller/auth/resetPass");
const { getSetPass, postSetPass } = require("../controller/auth/setNewPass");
// validator
const loginValidator = require("../validators/login");
const newPassValidartor = require("../validators/resetPassValid");

// middlewares
const { authAccess } = require("../middlewares/common/checker");
const locals = require("../middlewares/common/locals");

// user login route
route
  .route("/")
  .get(locals("Login"), authAccess, getLogin)
  .post(locals("Login"), authAccess, loginValidator, postLogin);

// route.get("/reset*/:id", getResetPass);
// send request for password reset route
route
  .route("/reset")
  .get(locals("Reset Password"), authAccess, getResetPass)
  .post(locals("Reset Password"), authAccess, postResetPass);

// set new password route
route.get("/reset/new/:key", locals("Reset Password"), authAccess, getSetPass);
route.post(
  "/reset/new",
  locals("Reset Password"),
  newPassValidartor,
  authAccess,
  postSetPass
);

module.exports = route;
