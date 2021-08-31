const bcrypt = require("bcrypt");
const Profile = require("../../Schemas/Profile");
const User = require("../../Schemas/Users");
const { validationResult } = require("express-validator");
const { errorMsgFormatter } = require("../../utils/utilites");

const controller = {};

// complete new profile

// get
controller.getCompleteProfile = (req, res, next) => {
  return res.render("pages/user-complete-profile", {
    error: "",
    user: {
      firstname: req.user.name.firstname,
      lastname: req.user.name.lastname,
    },
  });
};
// post
controller.postCompleteProfile = async (req, res, next) => {
  const {
    firstname,
    lastname,
    phone,
    password,
    country,
    city,
    state,
    street,
    zipcode,
  } = req.body;
  // errors
  const profileErr = validationResult(req).formatWith(errorMsgFormatter);
  const errMsg = profileErr.mapped();
  console.log(errMsg);
  if (!profileErr.isEmpty()) {
    res.render("pages/user-complete-profile", {
      error: errMsg,
      user: "",
    });
  } else {
    try {
      const hashPass = await bcrypt.hash(password, 11);
      const finalData = new Profile({
        userId: req.user._id,
        name: {
          firstname,
          lastname,
        },
        phone,
        avatar: req.file.filename,
        address: {
          country,
          city,
          state,
          street,
          zipcode,
        },
      });
      const profileData = await finalData.save();
      await User.findByIdAndUpdate(
        { _id: profileData.userId },
        {
          $set: {
            name: {
              firstname: profileData.name.firstname,
              lastname: profileData.name.lastname,
            },
            password: hashPass,
            avatar: profileData.avatar,
          },
        },
        { useFindAndModify: false }
      );
      return res.redirect("/tadmin");
    } catch (error) {
      console.log(error);
      res.status(500);
      next(error);
    }
  }
};

module.exports = controller;
