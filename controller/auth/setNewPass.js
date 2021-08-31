// dependencies
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const { decryptData, errorMsgFormatter } = require("../../utils/utilites");

// Schema
const User = require("../../Schemas/Users");

const controller = {};

controller.getSetPass = async (req, res, next) => {
  try {
    // taking token from params and decode
    const decode = decryptData(req.params.key);

    // find if the token is exist with any user
    const userData = await User.findOne({
      tempKeys: { $elemMatch: { resetpass: decode } },
    });
    if (userData) {
      return res.render("pages/auth/resetpass/setPass", {
        error: "",
        token: {
          key: req.params.key, //set the encoded token as a hidden html input value
        },
      });
    } else {
      return res.redirect("/auth");
    }
  } catch (error) {
    next(error);
  }
};

controller.postSetPass = async (req, res, next) => {
  // goru is the hidden input fields name, which have the encoded token
  const { password, goru } = req.body;

  // errors
  const resetErr = validationResult(req).formatWith(errorMsgFormatter);
  const errMsg = resetErr.mapped();
  console.log(errMsg);
  if (!resetErr.isEmpty()) {
    res.render("pages/auth/resetpass/setPass", {
      error: errMsg,
    });
  } else {
    try {
      const hashPass = await bcrypt.hash(password, 11); //hashing the new password
      const decode = decryptData(goru); //decode the token

      // find user with token and update password
      const userData = await User.findOneAndUpdate(
        {
          tempKeys: { $elemMatch: { resetpass: decode } },
        }, //after set new pass, removed previous token.
        {
          $set: {
            password: hashPass,
          },
          $pull: { tempKeys: { resetpass: decode } },
        },
        { useFindAndModify: false }
      );

      if (userData) {
        return res.redirect("/auth");
      } else {
        return res.redirect("/auth");
      }
    } catch (error) {
      res.status(500);
      next(error);
    }
  }
};

module.exports = controller;
