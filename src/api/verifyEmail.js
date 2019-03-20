const router = require("express").Router();
const User = require("../models/User");
const { sendResponse } = require("./../utils/sendResponse");
const { isGmailEnabled } = require("../utils/getConfigFile");
const { sendMail } = require("../utils/sendMail");

router.post("/verifyEmail", async function(req, res) {
  const usingGmail = await isGmailEnabled();
  if (!usingGmail) {
    return sendResponse(
      res,
      500,
      "Gmail not enabled. Do not use this endpoint."
    );
  }
  if (!req.body || !req.body.email || !req.body.pin) {
    return sendResponse(
      res,
      400,
      "Malformed request: email or pin not specified"
    );
  }
  let user;
  try {
    user = await User.findOne({ email: req.body.email });
  } catch (e) {
    return sendResponse(res, 400, e);
  }

  if (!user) {
    return sendResponse(res, 400, "User does not exist in the DB.");
  }
  if (user.verified === 1) {
    return sendResponse(res, 400, "User has already verified their email");
  }

  if (req.body.pin != user.pin) {
    return sendResponse(res, 400, "PIN does not match");
  }

  user.verified = true;
  await user.save();
  return sendResponse(res, 200, "User successfully verified");
});

module.exports = router;
