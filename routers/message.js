// dependences
const router = require("express").Router();

// controllers
const {
  getMessagePage,
  newConversation,
  startConversation,
  sendMessages,
  getAllMessages,
} = require("../controller/message");

// moddlewares
const { profileCheck, adminAccess } = require("../middlewares/common/checker");
const commonMiddleware = [adminAccess, profileCheck];
const locals = require("../middlewares/common/locals");
const { multiUpload } = require("../middlewares/common/uploader");

// index of messages
router
  .route("/messages")
  .get(locals("Messages"), commonMiddleware, getMessagePage);

router
  .route("/messages/new-conversation/:name")
  .post(commonMiddleware, newConversation);

router
  .route("/messages/start-conversation/")
  .post(commonMiddleware, startConversation);

router
  .route("/messages/new-message/")
  .post(
    commonMiddleware,
    multiUpload("messages").array("attachment"),
    sendMessages
  );

router
  .route("/messages/get-messages/:id")
  .get(commonMiddleware, getAllMessages);

module.exports = router;
