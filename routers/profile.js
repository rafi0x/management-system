const router = require("express").Router();

// controller
const {
  getCompleteProfile,
  postCompleteProfile,
} = require("../controller/profile/completeProfile");
const profileValidator = require("../validators/profile");
const { imgUpload } = require("../middlewares/common/uploader");
const { getUserProfile } = require("../controller/profile/userProfile");

// middlewares
const {
  adminAccess,
  accessProfileCheck,
} = require("../middlewares/common/checker");
const locals = require("../middlewares/common/locals");

router.route("/profile/:id").get(locals(), adminAccess, getUserProfile);

router
  .route("/complete-profile")
  .get(
    locals("Complete Profile"),
    adminAccess,
    accessProfileCheck,
    getCompleteProfile
  )
  .post(
    locals("Complete Profile"),
    imgUpload("avatars").single("avatar"),
    adminAccess,
    accessProfileCheck,
    profileValidator,
    postCompleteProfile
  );

module.exports = router;
