// dependencies
const { randomTextGen, encryptData } = require("../../utils/utilites");
const {
  mailTransporter,
  passResetMailTemplate,
} = require("../../utils/mailer");

// Schema
const User = require("../../Schemas/Users");

const controller = {};

// password reset panel
controller.getResetPass = (req, res, next) => {
  return res.render("pages/auth/resetpass/reset");
};

controller.postResetPass = async (req, res, next) => {
  const { username } = req.body;

  //generate a token for validate password reset
  const token = randomTextGen(10);

  try {
    const userData = await User.findOneAndUpdate(
      { username },
      {
        $push: {
          // pussing the token in user data
          tempKeys: {
            resetpass: token,
          },
        },
      },
      { useFindAndModify: false }
    );

    if (userData) {
      // encrypt the token
      const encodedToken = encryptData(token);

      // mailing token to user
      await mailTransporter.sendMail(
        passResetMailTemplate(
          userData.email,
          userData.name.firstname,
          `auth/reset/new/${encodedToken}` // email the reset token with reseter route
        ),
        (err, info) => {
          if (err) {
            console.log(err);
            next(err);
          } else {
            console.log("Pass reset mail sent: " + info.response);
          }
        }
      );
    }
    return res.render("pages/auth/resetpass/reset", {
      data: { send: "password reset link sent to your email" },
    });
  } catch (error) {
    res.status(500);
    next(error);
    console.log(error);
  }
};

module.exports = controller;
