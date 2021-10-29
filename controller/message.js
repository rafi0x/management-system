const controller = {};
const Profile = require("../Schemas/Profile");
const Conversation = require("../Schemas/Conversation");
const Messages = require("../Schemas/Message");
const { inputFilter } = require("../utils/utilites");

controller.getMessagePage = async (req, res, next) => {
  try {
    const existingConversations = await Conversation.find({
      $or: [
        { "creator.id": req.profile._id },
        { "participant.id": req.profile._id },
      ],
    });

    res.locals.data = existingConversations;
    return res.render("pages/message");
  } catch (error) {}
};

// search user for new conversation
controller.newConversation = async (req, res, next) => {
  const keyword = new RegExp(inputFilter(req.params.name), "i");
  try {
    const userData = await Profile.find(
      {
        _id: { $ne: req.profile._id }, // stop from getting logged in user profile.
        $or: [{ "name.firstname": keyword }, { "name.lastname": keyword }],
      },
      "name id avatar"
    );

    res.json(userData);
  } catch (err) {
    console.log(err);
  }
};

// start a conversation with a user
controller.startConversation = async (req, res, next) => {
  try {
    // conversation object
    const conversationData = new Conversation({
      creator: {
        name: `${req.profile.name.firstname} ${req.profile.name.lastname}`,
        id: req.profile._id,
        avatar: req.profile.avatar,
      },
      participant: {
        name: `${req.body.firstname} ${req.body.lastname}`,
        id: req.body.id,
        avatar: req.body.avatar,
      },
    });

    // search if this conersation already exists
    const existence = await Conversation.find({
      $or: [
        {
          "creator.id": req.profile._id,
          "participant.id": req.body.id,
        },
        { "creator.id": req.body.id, "participant.id": req.profile._id },
      ],
    });

    if (existence.length === 0) {
      await conversationData.save();
      res.json("success");
    } else {
      return res.redirect("/tadmin/messages");
    }
  } catch (error) {
    console.log(error);
  }
};

// send messages and store them
controller.sendMessages = async (req, res, next) => {
  try {
    let attachment = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        attachment.push(file.filename);
      });
    }
    console.log(attachment);
    const {
      conversationId,
      receiverId,
      receiverName,
      receiverAvatar,
      message,
    } = req.body;
    const newMessage = new Messages({
      conversation_id: conversationId,
      receiver: {
        id: receiverId,
        name: receiverName,
        avatar: receiverAvatar,
      },
      sender: {
        id: req.profile._id,
        name: `${req.profile.name.firstname} ${req.profile.name.lastname}`,
        avatar: req.profile.avatar,
      },
      message,
      attachment,
    });
    const saveMsg = newMessage.save();

    global.io.emit("new_message", {
      conversation_id: conversationId,
      sender_id: req.profile._id,
      message,
      attachment,
    });

    res.json(saveMsg);
  } catch (error) {
    console.log(error);
    next(500);
  }
};
// get all previous messages
controller.getAllMessages = async (req, res, next) => {
  const messages = await Messages.find({ conversation_id: req.params.id });
  // console.log(messages);
  res.json(messages);
};

module.exports = controller;
