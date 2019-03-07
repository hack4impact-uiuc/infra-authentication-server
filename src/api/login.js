const router = require("express").Router();
const cors = require("cors");
const jwt = require("jsonwebtoken");

var SECRET_TOKEN = "helga_has_n000000_idea_what_she_doin";
const User = require("../models/User");
const bodyParser = require("body-parser");
const { sendResponse } = require("./../utils/sendResponse");

router.post("/login", async function(req, res) {
  // no email or password provided --> invalid
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({
      status: 400,
      message: "Please enter valid arguments for the fields provided."
    });
  }
  // un-jwt-ify the given password, see if it's a match with the token associated with the email.
  var user = await User.findOne({ email: req.body.email });
  if (user) {
    if (user.googleAuth) {
      return res.status(400).send({
        status: 400,
        message: "Please login using Google."
      });
    }
    var decoded = jwt.verify(user.password, SECRET_TOKEN, {
      password: req.body.password
    });
    if (req.body.password === decoded.password) {
      return sendResponse(res, 200, "Successful login!");
    } else {
      return sendResponse(res, 400, "Passwword incorrect. Please try again.");
    }
  } else {
    return sendResponse(
      res,
      400,
      "The information you provided does not match our database. Please check your inputs again."
    );
  }
});

module.exports = router;
