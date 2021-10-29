const Profile = require("../../Schemas/Profile");
const controller = {};

controller.getUserProfile = async (req, res, next) => {
  try {
    const userProfile = await Profile.findOne({
      userId: req.params.id,
    }).populate("userId", { email: 1 });
    if (userProfile) {
      res.render("pages/profile", {
        title: `${userProfile.name.firstname} ${userProfile.name.lastname}`,
        data: userProfile,
      });
    } else {
      res.render("pages/profile");
    }
  } catch (error) {
    next(error);
  }
};

module.exports = controller;
