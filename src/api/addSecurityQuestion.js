const router = require("express").Router();
const cors = require("cors");
const jwt = require("jsonwebtoken");

var SECRET_TOKEN = "helga_has_n000000_idea_what_she_doin";
const User = require("../models/User");
const bodyParser = require("body-parser");
const { sendResponse } = require("./../utils/sendResponse");

router.post("/addSecurityQuestion", async function(req, res) {
  if (!req.body.question || !req.body.answer) {
    sendResponse(res, 400, "Please enter valid responses");
  }
  let decoded = {};
  try {
    decoded = jwt.verify(req.body.token, SECRET_TOKEN);
  } catch (e) {
    await sendResponse(res, 400, "Invalid token");
  }
  var user = await User.findOne({ email: decoded.email });
  if (user) {
    await User.updateOne(
      { _id: user._id },
      { question: req.body.question, answer: req.body.answer }
    );
    sendResponse(res, 200, "Succesfully added the security question");
  } else {
    sendResponse(res, 400, "User doesn't exist");
  }
});

module.exports = router;
