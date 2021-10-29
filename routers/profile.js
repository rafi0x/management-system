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

router.use([locals("Complete Profile"), adminAccess]);

router.route("/id/:id").get(locals(), getUserProfile);

router
  .route("/complete-profile")
  .get(getCompleteProfile)
  .post(
    imgUpload("avatars").single("avatar"),
    accessProfileCheck,
    profileValidator,
    postCompleteProfile
  );

module.exports = router;
