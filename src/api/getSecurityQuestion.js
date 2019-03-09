const router = require("express").Router();
const nodemailer = require("nodemailer");
const cors = require("cors");
const User = require("../models/User");
const bodyParser = require("body-parser");
const { sendResponse } = require("./../utils/sendResponse");

router.post("/getSecurityQuestion", async function(req, res) {
  if (!req.body || !req.body.email) {
    sendResponse(res, 400, "Malformed request");
    return;
  }
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    sendResponse(res, 400, "User does not exist in the database");
    return;
  }
  if (!user.question) {
    sendResponse(res, 400, "No security question set");
    return;
  }
  res.status(200).send({
    status: 200,
    question: user.question
  });
});

module.exports = router;
