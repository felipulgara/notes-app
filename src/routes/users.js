const router = require("express").Router();

router.get("/signin", (req, res) => {
  res.render("users/signin");
});

router.get("/signup", (req, res) => {
  res.render("users/signup");
});

router.post("/signup", (req, res) => {
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
    res.send("ok");
  }
});

module.exports = router;
