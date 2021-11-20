const Discussion = require("../../Schemas/Discussion");
const Task = require("../../Schemas/Tasks");

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
    await newMessage.save();
    return res.status(200);
  } catch (error) {
    console.log(error);
    return res.status(500);
  }
};

module.exports = controller;
