const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const { sendResponse } = require("./../utils/sendResponse");
const { signAuthJWT } = require("../utils/jwtHelpers");
const { isGmailEnabled } = require("../utils/getConfigFile");

router.post("/passwordReset", async function(req, res) {
  const gmailEnabled = await isGmailEnabled();
  if (
    !req.body ||
    !req.body.email ||
    !req.body.password ||
    (gmailEnabled && !req.body.pin) ||
    (!gmailEnabled && !req.body.answer)
  ) {
    sendResponse(res, 400, "Malformed request");
    return;
  }
  const user = await User.findOne({ email: req.body.email }).catch(e =>
    console.log(e)
  );
  if (!user) {
    sendResponse(res, 400, "User does not exist in the database");
    return;
  }
  if (gmailEnabled) {
    if (user.pin && user.pin != req.body.pin) {
      sendResponse(res, 400, "PIN does not match");
      return;
    }
    if (!user.expiration || user.expiration.getTime() < new Date().getTime()) {
      sendResponse(
        res,
        400,
        "PIN is expired or expiration field doesn't exist in the DB"
      );
      return;
    }
  } else {
    if (
      req.body.answer &&
      user.answer !== req.body.answer.toLowerCase().replace(/\s/g, "")
    ) {
      sendResponse(res, 400, "Answer to security question does not match");
      return;
    }
  }
  // user matches, change expiration
  var date = new Date();
  // remove a day to the current date to expire it
  // set date to 24 hours before because we don't want
  // concurrent requests happening in the same second to both go through
  // (i.e. if the user presses change password button twice)
  date.setDate(date.getDate() - 1);
  user.expiration = date;
  user.password = await bcrypt.hash(req.body.password, 10);
  await user.save();

  sendResponse(res, 200, "Password successfully reset", {
    token: signAuthJWT(user._id, user.password)
  });
});

module.exports = router;
