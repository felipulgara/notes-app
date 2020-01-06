const helpers = {};

helpers.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("err_msg", "No authorized");
  res.redirect("/users/signin");
};

module.exports = helpers;
