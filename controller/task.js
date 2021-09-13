const { validationResult } = require("express-validator");
const Users = require("../Schemas/Users");
const Tasks = require("../Schemas/Tasks");
const { inputFilter } = require("../utils/utilites");

const controller = {};

// get all tasks form db and show them
controller.getTask = async (req, res, next) => {
  try {
    const tasks = await Tasks.find();
    if (tasks) {
      res.locals.tasks = tasks;
      return res.render("pages/tasks");
    }
  } catch (err) {
    next(err);
  }
};

// this is for search user by their roule, in future it can be filter with teams, now there in no teams exist
controller.searchUserByTeam = async (req, res, next) => {
  try {
    const keyword = new RegExp(inputFilter(req.params.team), "i");
    const data = await Users.find({ roule: keyword }, "name id avatar");
    res.json({ user: data });
  } catch (err) {
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

module.exports = controller;
