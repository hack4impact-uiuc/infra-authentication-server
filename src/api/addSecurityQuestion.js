const router = require("express").Router();
const User = require("../models/User");
const { check, validationResult } = require("express-validator/check");
const { sendResponse } = require("./../utils/sendResponse");
const { decryptAuthJWT } = require("../utils/jwtHelpers");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_TOKEN = "helga_has_n000000_idea_what_she_doin";

router.post(
  "/addSecurityQuestion",
  [
    check("token")
      .custom(value => decryptAuthJWT(value) !== null)
      .withMessage("Invalid JWT"),
    check("question")
      .isString()
      .isLength({ min: 1 }),
    check("answer")
      .isString()
      .isLength({ min: 1 })
  ],
  async function(req, res) {
    // Input validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendResponse(res, 400, "Invalid request", {
        errors: errors.array({ onlyFirstError: true })
      });
    }
    if (!req.headers.token) {
      return sendResponse(res, 400, "Token not provided");
    }
    let authenticationStatus = {};
    try {
      authenticationStatus = jwt.verify(req.headers.token, SECRET_TOKEN);
    } catch (e) {
      return sendResponse(res, 400, "Invalid Token");
    }
    const user = await User.findById(authenticationStatus.userId);
    if (!user) {
      sendResponse(res, 400, "User does not exist in the database");
      return;
    } else {
      let authenticated = false;
      if (await bcrypt.compare(req.body.password, user.password)) {
        // hash matches! sign a JWT with an expiration 1 day in the future and send back to the user
        authenticated = true;
      }
      if (!authenticated) {
        return sendResponse(res, 400, "Incorrect Password");
      }
      await User.updateOne(
        { _id: user._id },
        {
          question: req.body.question,
          answer: req.body.answer.toLowerCase().replace(/\s/g, "")
        }
      );
      sendResponse(res, 200, "Succesfully added the security question");
    }
  }
);

module.exports = router;
