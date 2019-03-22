const router = require("express").Router();
const User = require("../models/User");
const { check, validationResult } = require("express-validator/check");
const { sendResponse } = require("./../utils/sendResponse");
const { decryptAuthJWT } = require("../utils/jwtHelpers");

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
    const usingGmail = await isGmailEnabled();
    var user = await User.findOne({ _id: userId });
    if (user.verified) {
      sendResponse(res, 400, "User is already verified");
    }
    if (user) {
      if (usingGmail) {
        // using gmail so it should send generate a PIN and send a verification email.
        generatePIN(user);
        const body = {
          from: "hack4impact.infra@gmail.com",
          to: user.email,
          subject: "New User Verification",
          text:
            "Thanks for signing up! Please enter the following PIN on the new user confirmation page" +
            user.pin
        };
        try {
          await sendMail(body);
          // success, so save the user to the DB and send back the JWT
          await user.save();
        } catch (e) {
          console.log(e);
          return sendResponse(
            res,
            500,
            "Verification email could not be sent despite Gmail being enabled. User not added to DB"
          );
        }
      } else {
        return sendResponse(
          res,
          500,
          "Endpoint invalid. Gmail is not enabled."
        );
      }
    } else {
      // user is not in the db, so let's tell the client
      return sendResponse(res, 400, "User does not exist in the database");
    }
  }
);

module.exports = router;
