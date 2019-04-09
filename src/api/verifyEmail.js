const router = require("express").Router();
const { header, validationResult } = require("express-validator/check");
const User = require("../models/User");
const { sendResponse } = require("./../utils/sendResponse");
const { isGmailEnabled } = require("../utils/getConfigFile");
const { decryptAuthJWT } = require("../utils/jwtHelpers");

router.post(
  "/verifyEmail",
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
      return sendResponse(
        res,
        500,
        "Gmail not enabled. Do not use this endpoint."
      );
    }
    if (!req.body || !req.body.pin) {
      return sendResponse(res, 400, "Malformed request: pin not specified");
    }
    const userId = decryptAuthJWT(req.headers.token);
    let user;
    try {
      user = await User.findOne({ _id: userId });
    } catch (e) {
      return sendResponse(res, 500, e.message);
    }
    if (!user) {
      return sendResponse(res, 400, "User does not exist in the DB.");
    }
    if (user.verified) {
      return sendResponse(res, 400, "User has already verified their email");
    }

    if (req.body.pin != user.pin) {
      return sendResponse(res, 400, "PIN does not match");
    }

    user.verified = true;
    await user.save();
    return sendResponse(res, 200, "User successfully verified");
  }
);

module.exports = router;
