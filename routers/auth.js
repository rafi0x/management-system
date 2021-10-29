// dependencies
const router = require("express").Router();
const { getLogin, postLogin } = require("../controller/auth/auth");
const { getResetPass, postResetPass } = require("../controller/auth/resetPass");
const { getSetPass, postSetPass } = require("../controller/auth/setNewPass");
// validator
const loginValidator = require("../validators/login");
const newPassValidartor = require("../validators/resetPassValid");

// middlewares
const locals = require("../middlewares/common/locals");
const { authAccess } = require("../middlewares/common/checker");
router.use(authAccess);

// user login route
router
  .route("/")
  .get(locals("Login"), getLogin)
  .post(locals("Login"), loginValidator, postLogin);

// route.get("/reset*/:id", getResetPass);
// send request for password reset route
router
  .route("/reset")
  .get(locals("Reset Password"), getResetPass)
  .post(locals("Reset Password"), postResetPass);

// set new password route
router.get("/reset/new/:key", locals("Reset Password"), getSetPass);
router.post(
  "/reset/new",
  locals("Reset Password"),
  newPassValidartor,
  postSetPass
);

module.exports = router;
