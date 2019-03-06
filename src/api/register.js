const router = require("express").Router();
const cors = require("cors");
const jwt = require("jsonwebtoken");

var SECRET_TOKEN = "helga_has_n000000_idea_what_she_doin";
const User = require("../models/User");
const bodyParser = require("body-parser");

router.post("/register", async function(req, res) {
  // app.post("/register", async function(req, res, next) {
  // no email or password provided --> invalid
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({
      status: 400,
      message: "Please enter valid arguments for the fields provided."
    });
  }

  // email already in database --> invalid
  if (await User.findOne({ email: req.body.email })) {
    return res.status(400).send({
      status: 400,
      message: "User already exists. Please try again."
    });
  }

  const jwt_token = jwt.sign(
    { email: req.body.email, password: req.body.password },
    SECRET_TOKEN
  );
  const user = new User({
    email: req.body.email,
    password: jwt_token
  });
  await user.save().then(user => {
    console.log("User added successfully");
  });
  return res.status(200).send({
    status: 200,
    message: "User added successfully!",
    token: jwt_token
  });
});

module.exports = router;
