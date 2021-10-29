// dependences
const router = require("express").Router();

// controllers
const {
  getMessagePage,
  startConversation,
  getAllMessages,
} = require("../controller/message");

// moddlewares
const {
  profileCheck,
  adminAccess,
  roleCheck,
} = require("../middlewares/common/checker");
const locals = require("../middlewares/common/locals");

router.use([locals("Messages"), adminAccess, profileCheck]);

// index of messages
router.route("/").get(getMessagePage);

router.route("/start-conversation/").post(startConversation);
router.route("/get-messages/:id").get(getAllMessages);

module.exports = router;
