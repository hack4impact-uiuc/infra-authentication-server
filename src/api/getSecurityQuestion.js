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

router.get("/getSecurityQuestion", async function(req, res) {
  if (!req.body || !req.body.email) {
    sendMalformedRequest(res);
    return;
  }
  const user = await User.findOne({ email: req.body.email }).catch(e => {
    console.log(e);
  });
  if (!user) {
    res.status(400).send({
      status: 400,
      message: "User does not exist in the database"
    });
    return;
  }
  if (!user.question) {
    res.status(400).send({
      status: 400,
      message: "No security question set"
    });
    return;
  }
  res.status(200).send({
    status: 200,
    question: user.question
  });
});

module.exports = router;
