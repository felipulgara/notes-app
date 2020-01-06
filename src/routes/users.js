const router = require("express").Router();
const passport = require("passport");

const User = require("../models/User");

router.get("/signin", (req, res) => {
  res.render("users/signin");
});

router.post(
  "/signin",
  passport.authenticate("local", {
    successRedirect: "/notes/notes",
    failureRedirect: "/users/signin",
    failureFlash: true
  })
);

router.get("/signup", (req, res) => {
  res.render("users/signup");
});

router.post("/signup", async (req, res) => {
  const { name, email, password, confirm_password } = req.body;
  const errors = [];
  if (
    name.length <= 0 ||
    email.length <= 0 ||
    password.length <= 0 ||
    confirm_password.length <= 0
  ) {
    errors.push({ text: "Please write text in the boxes" });
  }
  if (password != confirm_password) {
    errors.push({ text: "Password do not match" });
  }
  if (password.length < 4) {
    errors.push({ text: "Password must be at least 4 characters" });
  }
  if (errors.length > 0) {
    res.render("users/signup", {
      errors,
      name,
      email,
      password,
      confirm_password
    });
  } else {
    const emailUser = await User.findOne({ email: email });
    if (emailUser) {
      errors.push({ text: "Email is already in use" });
      res.render("users/signup", {
        errors,
        name,
        email,
        password,
        confirm_password
      });
    } else {
      const newUser = new User({ name, email, password });
      newUser.password = await newUser.encryptPassword(password);
      await newUser.save();
      req.flash("success_msg", "You are registered");
      res.redirect("/users/signin");
    }
  }
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
