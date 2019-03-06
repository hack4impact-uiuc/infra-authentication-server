const router = require("express").Router();
const nodemailer = require("nodemailer");
const cors = require("cors");
const User = require("../models/User");
const bodyParser = require("body-parser");

sendMalformedRequest = res => {
  res.status(400).send({
    status: 400,
    message: "Malformed request"
  });
};

router.post("/passwordReset", async function(req, res) {
  if (!req.body || !req.body.email) {
    sendMalformedRequest(res);
    return;
  }
  const user = await User.findOne({ email: req.body.email }).catch(e =>
    console.log(e)
  );
  if (!user) {
    res.status(400).send({
      status: 400,
      message: "User does not exist in the database"
    });
    return;
  }
  if (user.pin && user.pin != req.body.pin) {
    res.status(400).send({
      status: 400,
      message: "PIN does not match"
    });
    return;
  }
  if (!user.expiration || user.expiration.getTime() < new Date().getTime()) {
    res.status(400).send({
      status: 400,
      message: "PIN is expired or expiration field doesn't exist in the DB"
    });
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

  res.status(200).send({
    status: 200,
    message: "Password successfully reset"
  });
});

module.exports = router;
