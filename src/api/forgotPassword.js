const router = require("express").Router();
const User = require("../models/User");
const { check, validationResult } = require("express-validator/check");
const { sendResponse } = require("./../utils/sendResponse");
const { isGmailEnabled } = require("../utils/getConfigFile");
const { sendMail } = require("../utils/sendMail");
const { generateAndCommitPIN } = require("../utils/pinHelpers");

router.post(
  "/forgotPassword",
  [
    check("email").isEmail(),
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
    if (!usingGmail) {
      return sendResponse(
        res,
        500,
        "Gmail not enabled. Do not use this endpoint."
      );
    }
    const user = await User.findOne({ email: req.body.email }).catch(e =>
      console.log(e)
    );

    // TODO: handle the config file change in security question
    if (!user) {
      return sendResponse(res, 400, "User does not exist in the DB.");
    }
    if (
      req.body.answer &&
      user.answer === req.body.answer.toLowerCase().replace(/\s/g, "")
    ) {
      generatePIN(user);
      await user.save();
      const body = {
        from: "hack4impact.infra@gmail.com",
        to: user.email,
        subject: "Forgot Password",
        text: "Enter the following pin on the reset page: " + user.pin
      };
      await sendMail(body);
      sendResponse(res, 200, "Sent password reset PIN to user if they exist");
    } else {
      sendResponse(res, 400, "Answer to security question doesn't match");
    }
  }
);

module.exports = router;
