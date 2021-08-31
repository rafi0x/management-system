// dependences
const User = require("../Schemas/Users");
const Profile = require("../Schemas/Profile");
const bcrypt = require("bcrypt");
const { errorMsgFormatter, randomTextGen } = require("../utils/utilites");
const { validationResult } = require("express-validator");
const { mailTransporter, newUserMailTemplate } = require("../utils/mailer");

const controller = {};

// show all employess
controller.getEmployees = async (req, res, next) => {
  try {
    const user = await User.find();
    if (user) {
      res.locals.user = user;
      res.render("pages/employees");
    }
  } catch (error) {
    next(error);
  }
};

// add new employess
controller.postNewAndUpdateUser = async (req, res, next) => {
  const { firstname, lastname, username, email, roule, status } = req.body;
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
        roule,
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
// controller.postUpdateUser = async (req, res, next) => {
//   const { userId, usernameEdit, emailEdit, rouleEdit, statusEdit } = req.body;
//   console.log("from controller");
//   console.log(req.body);
//   try {
//     if (userId) {
//       const userUpdate = await User.findOneAndUpdate(
//         { _id: userId },
//         {
//           $set: {
//             username: usernameEdit,
//             email: emailEdit,
//             roule: rouleEdit,
//             status: statusEdit,
//           },
//         },
//         { useFindAndModify: false }
//       );
//       return res.redirect("/tadmin/employees");
//     }
//   } catch (err) {
//     console.log(err);
//     next(err);
//   }
// };

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
