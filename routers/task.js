// dependences
const router = require("express").Router();

const { getTask, addNewTasks } = require("../controller/task");

// moddlewares
const {
  profileCheck,
  adminAccess,
  roleCheck,
} = require("../middlewares/common/checker");
const locals = require("../middlewares/common/locals");
const { multiUpload } = require("../middlewares/common/uploader");

const validator = require("../validators/task");

router.use([locals("Tasks"), adminAccess, profileCheck]);

router
  .route("/")
  .get(getTask)
  .post(
    roleCheck(["manager", "srDev"]),
    multiUpload("tasksUpload").array("attachments"),
    validator,
    addNewTasks
  );

module.exports = router;
