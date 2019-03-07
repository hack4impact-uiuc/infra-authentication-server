const router = require("express").Router();
const nodemailer = require("nodemailer");
const cors = require("cors");
const User = require("../models/User");
const bodyParser = require("body-parser");
const sendResponse = require("./../utils/sendResponse");

router.post("/passwordReset", async function(req, res) {
  if (!req.body || !req.body.email) {
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
  // user matches, change expiration
  var date = new Date();
  // remove a day to the current date to expire it
  // set date to 24 hours before because we don't want
  // concurrent requests happening in the same second to both go through
  // (i.e. if the user presses change password button twice)
  date.setDate(date.getDate() - 1);
  user.expiration = date;
  user.password = req.body.password;
  await user.save();

  sendResponse(res, 200, "Password successfully reset");
});

module.exports = router;
