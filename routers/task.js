// dependences
const router = require("express").Router();

const {
  getTask,
  searchUserByTeam,
  addNewTasks,
} = require("../controller/task");

// moddlewares
const { profileCheck, adminAccess } = require("../middlewares/common/checker");
const commonMiddleware = [adminAccess, profileCheck];
const locals = require("../middlewares/common/locals");
const { multiUpload } = require("../middlewares/common/uploader");

const validator = require("../validators/task");

router
  .route("/tasks")
  .get(locals("Tasks"), commonMiddleware, getTask)
  .post(
    commonMiddleware,
    multiUpload("tasksUpload").array("attachments"),
    validator,
    addNewTasks
  );

router.post("/tasks/:team", commonMiddleware, searchUserByTeam);

module.exports = router;
