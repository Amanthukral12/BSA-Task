const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { expressjwt } = require("express-jwt");

exports.signup = (req, res) => {
  const user = new User(req.body);
  user
    .save()
    .then((user) => {
      res.json({
        name: user.name,
        email: user.email,
      });
    })
    .catch((error) => {
      return res.status(400).json({
        error: "Not able to save",
      });
    });
};

exports.signin = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }).then((user) => {
    if (!user) {
      return res.status(400).json({
        error: "User does not exists",
      });
    }
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Password is incorrect",
      });
    }
    const authToken = jwt.sign({ _id: user._id }, process.env.SECRET);
    res.cookie("token", authToken, { expire: new Date() + 9999 });
    const { name } = user;
    return res.json({ authToken, user: { name } });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "User logged out successfully",
  });
};

exports.isSignedIn = expressjwt({
  secret: process.env.SECRET,
  algorithms: ["HS256"],
  userProperty: "auth",
});
