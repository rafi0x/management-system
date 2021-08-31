const Profile = require("../Schemas/Profile");
const User = require("../Schemas/Users");
const Conversation = require("../Schemas/Conversation");
const Message = require("../Schemas/Message");
const fs = require("fs");
const path = require("path");
const controller = {};

controller.getSettings = (req, res, next) => {
  const oldAvatar = req.profile.avatar;
  return res.render("pages/settings");
};

controller.postSettings = async (req, res, next) => {
  const bodyObject = req.body;
  try {
    if (req.file !== undefined) {
      // update avatar in everywhere
      await Profile.findOneAndUpdate(
        { _id: req.profile._id },
        {
          $set: {
            avatar: req.file.filename,
          },
        },
        { useFindAndModify: false }
      );
      await User.findOneAndUpdate(
        { _id: req.profile.userId },
        {
          $set: {
            avatar: req.file.filename,
          },
        },
        { useFindAndModify: false }
      );

      await Conversation.updateMany(
        { "creator.id": req.profile._id },
        { $set: { "creator.avatar": req.file.filename } }
      );
      await Conversation.updateMany(
        { "participant.id": req.profile._id },
        { $set: { "participant.avatar": req.file.filename } }
      );
      await Message.updateMany(
        { "sender.id": req.profile._id },
        { $set: { "sender.avatar": req.file.filename } }
      );
      await Message.updateMany(
        { "receiver.id": req.profile._id },
        { $set: { "receiver.avatar": req.file.filename } }
      );

      // delete old avatar from storage
      fs.unlink(
        path.join(__dirname, `../public/uploads/avatars/${req.profile.avatar}`),
        (err) => {
          if (err) throw err;
          console.log(err);
        }
      );
    }
    if (Object.keys(bodyObject).length === 8) {
      await Profile.findOneAndUpdate(
        { _id: req.profile._id },
        {
          $set: {
            name: {
              firstname: bodyObject.firstname || req.profile.name.firstname,
              lastname: bodyObject.lastname || req.profile.name.lastname,
            },
            address: {
              country: bodyObject.country || req.profile.address.country,
              city: bodyObject.city || req.profile.address.city,
              state: bodyObject.state || req.profile.address.state,
              street: bodyObject.street || req.profile.address.street,
              zipcode: bodyObject.zipcode || req.profile.address.zipcode,
            },
            avatar: req.file ? req.file.filename : req.profile.avatar,
            phone: bodyObject.phone || req.profile.phone,
          },
        }
      );
      await User.findOneAndUpdate(
        { _id: req.profile.userId },
        {
          $set: {
            name: {
              firstname: bodyObject.firstname || req.profile.name.firstname,
              lastname: bodyObject.lastname || req.profile.name.lastname,
            },
            avatar: req.file ? req.file.filename : req.profile.avatar,
          },
        }
      );

      // updating the name in conversations and messages
      await Conversation.updateMany(
        { "creator.id": req.profile._id },
        {
          $set: {
            "creator.name": `${bodyObject.firstname} ${bodyObject.lastname}`,
          },
        }
      );
      await Conversation.updateMany(
        { "participant.id": req.profile._id },
        {
          $set: {
            "participant.name": `${bodyObject.firstname} ${bodyObject.lastname}`,
          },
        }
      );
      await Message.updateMany(
        { "sender.id": req.profile._id },
        {
          $set: {
            "sender.name": `${bodyObject.firstname} ${bodyObject.lastname}`,
          },
        }
      );
      await Message.updateMany(
        { "receiver.id": req.profile._id },
        {
          $set: {
            "receiver.name": `${bodyObject.firstname} ${bodyObject.lastname}`,
          },
        }
      );
    } else if (Object.keys(bodyObject).length === 3) {
      console.log(bodyObject);
    } else {
      console.log(bodyObject);
    }
  } catch (error) {
    console.log(error.message);
    next(500);
  }
  return res.redirect("/tadmin/settings");
};

module.exports = controller;
