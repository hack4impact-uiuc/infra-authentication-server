const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const { sendResponse } = require("./../utils/sendResponse");
const { signAuthJWT } = require("../utils/jwtHelpers");

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
    if (await bcrypt.compare(req.body.password, user.password)) {
      // hash matches! sign a JWT with an expiration 1 day in the future and send back to the user
      const jwt_token = signAuthJWT(user._id, user.password);
      return res.status(200).send({
        status: 200,
        message: "Successful login!",
        token: jwt_token
      });
    } else {
      // password doesn't match the hashed
      return sendResponse(res, 400, "Password incorrect. Please try again.");
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
