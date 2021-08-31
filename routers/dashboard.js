// dependences
const router = require("express").Router();

// controllers
const {
  getIndx,
  getMail,
  getMeetings,
  getTask,
} = require("../controller/dashboard");
const {
  getEmployees,
  postNewAndUpdateUser,
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
} = require("../middlewares/common/checker");
const commonMiddleware = [adminAccess, profileCheck];
const locals = require("../middlewares/common/locals");
const { imgUpload } = require("../middlewares/common/uploader");

// index route of dahsboard
router.route("/").get(locals("Dashboard"), commonMiddleware, getIndx);

// mail
router.route("/mail").get(locals("Mail"), commonMiddleware, getMail);

// meetings
router
  .route("/meetings")
  .get(locals("Meetings"), commonMiddleware, getMeetings);

// tasks
router.route("/tasks").get(locals("Tasks"), commonMiddleware, getTask);

// employees
router
  .route("/employees")
  .get(locals("Employees"), commonMiddleware, getEmployees)
  .post(locals("Employess"), userAddValidator, postNewAndUpdateUser);
router.get("/employees/delete/:id", commonMiddleware, deleteUser);

// seetings
router
  .route("/settings")
  .get(locals("Settings"), commonMiddleware, getSettings)
  .post(imgUpload("avatars").single("avatar"), commonMiddleware, postSettings);

router.route("/logout").get(commonMiddleware, userLogout);

module.exports = router;
