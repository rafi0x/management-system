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
const locals = require("../middlewares/common/locals");
const {
  profileCheck,
  adminAccess,
  roleCheck,
} = require("../middlewares/common/checker");

router.use([locals("Employees"), adminAccess, profileCheck]);

// employees
router
  .route("/")
  .get(roleCheck(["admin"]), getEmployees)
  .post(roleCheck(["admin"]), userAddValidator, postNewAndUpdateUser);

router.put("/", roleCheck(["admin"]), putUpdateUser);
router.get("/delete/:id", roleCheck(["admin"]), deleteUser);

module.exports = router;
