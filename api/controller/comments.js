const Discussion = require("../../Schemas/Discussion");
const Profile = require("../../Schemas/Profile");

const controller = {};

controller.comments = async (req, res, next) => {
  try {
    let attachment = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        attachment.push(file.filename);
      });
    }

    const { message, taskId, creator } = req.body;
    const newMessage = new Discussion({
      task_id: taskId,
      creator,
      message,
      attachment,
    });
    const saved = await newMessage.save();
    const creatorInfo = await Profile.findOne({ _id: creator }, "name avatar");

    global.io.emit("new_comment", { newMessage, creatorInfo });

    if (!saved) return res.status(500).json({ err: "server error" });
    return res.status(200);
  } catch (error) {
    console.log(error);
    return res.status(500);
  }
};

module.exports = controller;
