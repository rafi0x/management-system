const User = require("../../Schemas/Users");
const Profile = require("../../Schemas/Profile");

// heres are all checker middlewares, which are checks various conditions
const check = {};

// if user logged in, user data will be bind with the req.
check.isUserLoggedIn = () => {
  return async (req, res, next) => {
    if (!req.session.isLoggedIn) {
      return next();
    }
    try {
      const userData = await User.findOne({
        username: req.session.user.username,
      }).select({
        password: 0,
        createTime: 0,
        __v: 0,
      });
      const userProfile = await Profile.findOne({
        userId: userData._id,
      }).populate("userId", { email: 1 });
      req.user = userData;
      req.profile = userProfile;
      next();
    } catch (err) {
      console.log(err.message);
      next(err);
    }
  };
};

// check if the use have a profile, if not redirect to create profile
check.profileCheck = (req, res, next) => {
  if (req.profile) {
    return next();
  } else {
    return res.redirect("/tadmin/complete-profile");
  }
};
// if user have profile then cant access
check.accessProfileCheck = (req, res, next) => {
  if (req.profile) {
    return res.redirect("/tadmin");
  } else {
    next();
  }
};

// if user logged in, block access to login panel again
check.adminAccess = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/auth");
  }
  next();
};

// if user not logged in, block acces to admin panel
check.authAccess = (req, res, next) => {
  if (req.session.isLoggedIn) {
    return res.redirect("/tadmin");
  }
  next();
};

// for logout the user.
check.userLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return next(err);
    }
  });
  res.redirect("/auth");
};

module.exports = check;
