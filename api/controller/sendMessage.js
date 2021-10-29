const Messages = require("../../Schemas/Message");

const controller = {};

controller.sendMessages = async (req, res, next) => {
  try {
    let attachment = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        attachment.push(file.filename);
      });
    }

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

    return res.status(200).json(saveMsg);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

module.exports = controller;
