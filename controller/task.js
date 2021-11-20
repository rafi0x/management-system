const { validationResult } = require("express-validator");
const Tasks = require("../Schemas/Tasks");
const Discussion = require("../Schemas/Discussion");

const controller = {};

// get all tasks form db and show them
controller.getTask = async (req, res, next) => {
  try {
    const tasks = await Tasks.find({
      users: { $in: [req.user._id] },
    }).populate({
      path: "users",
      select: "id name avatar",
    });
    if (tasks.length !== 0) {
      res.locals.tasks = tasks;
      return res.render("pages/tasks");
    }
    res.locals.tasks = [];

    return res.render("pages/tasks");
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// this is for save new tasks
controller.addNewTasks = async (req, res, next) => {
  const { title, description, users, expDate, expTime } = req.body;
  const inputErr = validationResult(req);
  if (!inputErr.isEmpty()) {
    // send error as json
    return res.json({
      error: inputErr.mapped(),
    });
  } else {
    try {
      const newTask = new Tasks({
        creator: req.user._id,
        title,
        description,
        users,
        deadLine: new Date(`${expDate}T${expTime}`),
      });
      await newTask.save();
      return res.json({ success: true });
    } catch (err) {
      next(err);
    }
  }
};

controller.getDiscussions = async (req, res, next) => {
  const allDiscussions = await Discussion.find({ task_id: req.body.id });
  console.log(allDiscussions);
};

module.exports = controller;
