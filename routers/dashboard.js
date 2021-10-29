// dependences
const router = require("express").Router();

// controllers
const { getIndx, getMail, getMeetings } = require("../controller/dashboard");
const {
  getEmployees,
  postNewAndUpdateUser,
  putUpdateUser,
  deleteUser,
} = require("../controller/employees");

const { getSettings, postSettings } = require("../controller/settings");

// validator
const { userAddValidator } = require("../validators/userRegister");

// moddlewares
const {
  userLogout,
  profileCheck,
  adminAccess,
  roleCheck,
} = require("../middlewares/common/checker");
const locals = require("../middlewares/common/locals");
const { imgUpload, multiUpload } = require("../middlewares/common/uploader");

// common middleware
router.use([adminAccess, profileCheck]);

// index route of dahsboard
router.route("/").get(locals("Dashboard"), getIndx);

// mail
router.route("/mail").get(locals("Mail"), getMail);

// seetings
router
  .route("/settings")
  .get(locals("Settings"), getSettings)
  .post(imgUpload("avatars").single("avatar"), postSettings);

router.route("/logout").get(userLogout);

module.exports = router;
