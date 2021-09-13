// dependences
const router = require("express").Router();

// controllers
const {
  getEmployees,
  postNewAndUpdateUser,
  putUpdateUser,
  deleteUser,
} = require("../controller/employees");

// validator
const { userAddValidator } = require("../validators/userRegister");

// moddlewares
const { profileCheck, adminAccess } = require("../middlewares/common/checker");
const commonMiddleware = [adminAccess, profileCheck];
const locals = require("../middlewares/common/locals");
const { imgUpload } = require("../middlewares/common/uploader");

// employees
router
  .route("/employees")
  .get(locals("Employees"), commonMiddleware, getEmployees)
  .post(
    locals("Employess"),
    commonMiddleware,
    userAddValidator,
    postNewAndUpdateUser
  )
  .put(locals("Employess"), commonMiddleware, putUpdateUser);
router.get("/employees/delete/:id", commonMiddleware, deleteUser);

module.exports = router;
