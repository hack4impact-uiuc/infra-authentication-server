const router = require("express").Router();
const User = require("../models/User");
const { header, validationResult } = require("express-validator/check");
const { sendResponse } = require("./../utils/sendResponse");
const { decryptAuthJWT } = require("../utils/jwtHelpers");
const { isGmailEnabled } = require("../utils/getConfigFile");
const { generatePIN } = require("../utils/pinHelpers");
const { sendMail } = require("../utils/sendMail");
router.post(
  "/resendVerificationEmail",
  [
    header("token")
      .custom(value => decryptAuthJWT(value) !== null)
      .withMessage("Invalid JWT")
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
    if (!usingGmail) {
      return sendResponse(res, 500, "Endpoint invalid. Gmail is not enabled.");
    }
    const userId = decryptAuthJWT(req.headers.token);
    let user;
    try {
      user = await User.findOne({ _id: userId });
    } catch (e) {
      return sendResponse(res, 500, e.message);
    }
    if (!user) {
      return sendResponse(res, 400, "User doesn't exist in the DB");
    }
    if (user.verified) {
      sendResponse(res, 400, "User is already verified");
    }

    // All the validation checks passed, so let's try and send the email
    generatePIN(user);
    const body = {
      from: "hack4impact.infra@gmail.com",
      to: user.email,
      subject: "New User Verification",
      text:
        "Thanks for signing up! Please enter the following PIN on the new user confirmation page: " +
        user.pin
    };
    try {
      await sendMail(body);
      // success, so save the user to the DB and send back the JWT
      // note that the PIN does not change if the email can't be sent
      await user.save();
      return sendResponse(res, 200, "Verification email successfully resent");
    } catch (e) {
      console.log(e);
      return sendResponse(
        res,
        500,
        "Verification email could not be sent despite Gmail being enabled. User not added to DB"
      );
    }
  }
);

module.exports = router;
