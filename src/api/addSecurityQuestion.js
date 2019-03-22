const router = require("express").Router();
const User = require("../models/User");
const { sendResponse } = require("./../utils/sendResponse");
const { decryptAuthJWT } = require("../utils/jwtHelpers");

router.post("/addSecurityQuestion", async function(req, res) {
  if (!req.headers.token || !req.body.question || !req.body.answer) {
    return sendResponse(res, 400, "Malformed Request");
  }
  const userId = decryptAuthJWT(req.headers.token);
  if (userId === null) {
    return sendResponse(res, 400, "Invalid token");
  }
  var user = await User.findOne({ _id: userId });
  if (user) {
    await User.updateOne(
      { _id: user._id },
      {
        question: req.body.question,
        answer: req.body.answer.toLowerCase().replace(/\s/g, "")
      }
    );
    sendResponse(res, 200, "Succesfully added the security question");
  } else {
    sendResponse(res, 400, "User doesn't exist");
  }
});

module.exports = router;
