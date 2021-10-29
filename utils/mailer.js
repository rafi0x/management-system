const nodemailer = require("nodemailer");

const mailer = {};
// nodemail config
mailer.mailTransporter = nodemailer.createTransport({
  service: process.env.SERVER_MAIL_SERVICE,
  auth: {
    user: process.env.SERVER_MAIL_USER,
    pass: process.env.SERVER_MAIL_PASS,
  },
});

mailer.newUserMailTemplate = (to, name, user, pass) => {
  const mailBody = {
    from: process.env.ADMIN_EMAIL,
    to,
    subject: "Account Created",
    text: `Hi ${name},
    \nyour account created.
    \nusername: ${user}\npassword: ${pass}
    \nlogin: http://localhost:5050/auth/ 
    \n\ndon't forget to change your password.`,
  };
  return mailBody;
};

mailer.passResetMailTemplate = (to, name, code) => {
  const mailBody = {
    from: process.env.ADMIN_EMAIL,
    to,
    subject: "Reset Password",
    text: `Hi ${name},
    \nYou make a request for reset your current password.
    \nClick the link blow, and set your new password
    \n${process.env.DOMAIN}${code}
    \n\nGood day.`,
  };
  return mailBody;
};

module.exports = mailer;
