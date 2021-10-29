const Users = require("../../Schemas/Users");
const Profile = require("../../Schemas/Profile");
const { inputFilter } = require("../../utils/utilites");

const controller = {};

controller.searchUserByName = async (req, res) => {
  const keyword = new RegExp(inputFilter(req.params.name), "i");
  try {
    if (req.profile) {
      const userData = await Profile.find(
        {
          _id: { $ne: req.profile._id }, // stop from getting logged in user profile.
          $or: [{ "name.firstname": keyword }, { "name.lastname": keyword }],
        },
        "name id avatar"
      );
      return res.status(200).json(userData);
    }

    const userData = await Profile.find(
      {
        $or: [{ "name.firstname": keyword }, { "name.lastname": keyword }],
      },
      "name id avatar"
    );
    return res.status(200).json(userData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

controller.searchUserByRole = async (req, res) => {
  try {
    const keyword = new RegExp(inputFilter(req.params.role), "i");
    const data = await Users.find({ role: keyword }, "name id avatar");
    return res.status(200).json({ user: data });
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

module.exports = controller;
