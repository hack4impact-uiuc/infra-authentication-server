const router = require("express").Router();
const nodemailer = require("nodemailer");
const User = require("../models/User");
const { sendResponse } = require("./../utils/sendResponse");
const { isGmailEnabled } = require("../utils/getConfigFile");
const { sendMail } = require("../utils/sendMail");
router.post("/forgotPassword", async function(req, res) {
  const usingGmail = await isGmailEnabled();
  if (!usingGmail) {
    return sendResponse(
      res,
      500,
      "Gmail not enabled. Do not use this endpoint."
    );
  }
  if (!req.body || !req.body.email || (usingGmail && !req.body.answer)) {
    return sendResponse(res, 400, "Malformed request");
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
    //user found, update pin
    user.pin = Math.floor(Math.random() * (100000000 - 100000 + 1)) + 100000;
    var date = new Date();
    // add a day to the current date
    date.setDate(date.getDate() + 1);
    user.expiration = date;
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
    sendResponse(res, 200, "Answer to security question doesn't match");
  }
});

module.exports = router;
