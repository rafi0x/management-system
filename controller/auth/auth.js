// dependencies
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const { errorMsgFormatter } = require("../../utils/utilites");

// Schema
const User = require("../../Schemas/Users");

// controllre object
const controller = {};

// login panel
controller.getLogin = (req, res, next) => {
  return res.status(200).render("pages/auth/login", {
    error: "",
  });
};

// login verification
controller.postLogin = async (req, res, next) => {
  const { username, password, rememberLogin } = req.body;
  const loginErr = validationResult(req).formatWith(errorMsgFormatter);
  const errMsg = loginErr.mapped();
  res.locals.error = errMsg;
  if (!loginErr.isEmpty()) {
    res.render("pages/auth/login");
  } else {
    try {
      const userData = await User.findOne({ username });
      if (!userData) {
        errMsg.invalidLogin = "Invalid username or password";
        return res.render("pages/auth/login");
      }
      const passMatch = await bcrypt.compare(password, userData.password);
      if (!passMatch) {
        errMsg.invalidLogin = "Invalid username or password";
        return res.render("pages/auth/login");
      }
      // if user select remember login, sessions maxAge will be null
      if (rememberLogin) {
        req.session.cookie.maxAge = null;
      }

      req.session.isLoggedIn = true;

      // binding users datas with user session
      req.session.user = userData;
      return res.redirect("/tadmin");
    } catch (err) {
      console.log(err.message);
      res.status(500);
      next(err);
    }
  }
};

module.exports = controller;
