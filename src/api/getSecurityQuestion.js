const router = require("express").Router();
const { check, validationResult } = require("express-validator/check");
const User = require("../models/User");
const { sendResponse } = require("./../utils/sendResponse");

router.post("/getSecurityQuestion", check("email").isEmail(), async function(
  req,
  res
) {
  // Input validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendResponse(res, 400, "Invalid request", {
      errors: errors.array({ onlyFirstError: true })
    });
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
