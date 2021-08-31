module.exports = (pageTitle) => {
  return (req, res, next) => {
    res.locals.title = pageTitle || "Welcome";
    res.locals.profile = req.profile ? req.profile : {};
    res.locals.user = req.user ? req.user : {};
    res.locals.data = {};
    res.locals.error = {};
    next();
  };
};

// set page title in response local, so that no need to tell title in ever render :)
