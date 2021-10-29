// dependences
const User = require("../Schemas/Users");
const Profile = require("../Schemas/Profile");
const bcrypt = require("bcrypt");
const { randomTextGen } = require("../utils/utilites");
const { validationResult } = require("express-validator");
const { mailTransporter, newUserMailTemplate } = require("../utils/mailer");

const controller = {};

// show all employess
controller.getEmployees = async (req, res, next) => {
  try {
    const user = await User.find();
    if (user.length !== 0) {
      res.locals.data = user;
      return res.render("pages/employees");
    }
    return res.render("pages/employees");
  } catch (error) {
    next(error);
  }
};

// add new employess
controller.postNewAndUpdateUser = async (req, res, next) => {
  const { firstname, lastname, username, email, role, status } = req.body;
  const inputErr = validationResult(req);
  if (!inputErr.isEmpty()) {
    // send error as json
    return res.json({
      error: inputErr.mapped(),
    });
  } else {
    try {
      const nPass = randomTextGen(7);
      const hashPassword = await bcrypt.hash(nPass, 11);
      const finalUserData = new User({
        name: {
          firstname,
          lastname,
        },
        username,
        email,
        password: hashPassword,
        role,
        status,
      });
      const userData = await finalUserData.save();
      console.log(userData);
      // if user saved in db then send confirm mail
      if (userData) {
        await mailTransporter.sendMail(
          newUserMailTemplate(
            userData.email,
            userData.name.firstname,
            userData.username,
            nPass
          ),
          (err, info) => {
            if (err) {
              console.log(err);
              next(err);
            } else {
              console.log("Email sent: " + info.response);
            }
          }
        );
      }
      return res.json({
        success: "user saved",
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
};

// update user
controller.putUpdateUser = async (req, res, next) => {
  const { userId, roleEdit, statusEdit } = req.body;

  try {
    if (roleEdit && statusEdit && userId) {
      console.log(req.body);
      await User.findOneAndUpdate(
        { _id: userId },
        {
          $set: {
            role: roleEdit,
            status: statusEdit,
          },
        },
        { useFindAndModify: false }
      );
      return res.json({ upate: "success" });
    } else if (roleEdit && userId) {
      console.log(req.body);
      await User.findOneAndUpdate(
        { _id: userId },
        {
          $set: {
            role: roleEdit,
          },
        },
        { useFindAndModify: false }
      );
      return res.json({ upate: "success" });
    } else if (statusEdit && userId) {
      console.log(req.body);
      await User.findOneAndUpdate(
        { _id: userId },
        {
          $set: {
            status: statusEdit,
          },
        },
        { useFindAndModify: false }
      );
      return res.json({ upate: "success" });
    } else {
      return res.json({ error: "can't be empty" });
    }
  } catch (err) {
    console.log(err);
  }
};

// delete  user
controller.deleteUser = async (req, res, next) => {
  const id = req.params.id;
  try {
    await User.findOneAndDelete({ _id: id });
    await Profile.findOneAndDelete({ userId: id });
    return res.redirect("/tadmin/employees");
  } catch (error) {
    next(error);
  }
};

module.exports = controller;
