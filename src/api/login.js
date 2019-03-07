const router = require("express").Router();
const cors = require("cors");
const jwt = require("jsonwebtoken");

const { SECRET_TOKEN } = require("../utils/secret-token");
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
      const jwt_token = jwt.sign(
        { email: req.body.email, password: req.body.password },
        SECRET_TOKEN
      );
      return res.status(200).send({
        status: 200,
        message: "Successful login!",
        token: jwt_token
      });
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
