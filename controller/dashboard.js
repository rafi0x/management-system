const controller = {};

controller.getIndx = (req, res, next) => {
  return res.render("pages/blank");
};

controller.getMail = (req, res, next) => {
  res.render("pages/blank");
};

controller.getSettings = (req, res, next) => {
  res.render("pages/settings");
};

module.exports = controller;
