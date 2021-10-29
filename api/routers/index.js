// dependences
const router = require("express").Router();

const { searchUserByRole, searchUserByName } = require("../controller/search");
const { sendMessages } = require("../controller/sendMessage");

// moddlewares
const {
  profileCheck,
  adminAccess,
  roleCheck,
} = require("../../middlewares/common/checker");
const { multiUpload } = require("../../middlewares/common/uploader");
const commonMiddleware = [adminAccess, profileCheck];

// <--- search
router.route("/search-user/:name").post(searchUserByName);

router.route("/search-role-user/:role").post(searchUserByRole);
// end --->

// <--- message
router
  .route("/new-message/")
  .post(multiUpload("messages").array("attachment"), sendMessages);
// end --->

module.exports = router;
