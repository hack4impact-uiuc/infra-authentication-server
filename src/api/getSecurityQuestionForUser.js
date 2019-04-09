const router = require("express").Router();
const { check, validationResult } = require("express-validator/check");
const { sendResponse } = require("./../utils/sendResponse");
const User = require("../models/User");

router.get(
  "/getSecurityQuestionForUser",
  check("email").isEmail(),
  async function(req, res) {
    // Input validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendResponse(res, 400, "Invalid request", {
        errors: errors.array({ onlyFirstError: true })
      });
    }
    const user = await User.find({ email: req.headers.email });
    if (!user || !user.length) {
      return sendResponse(res, 400, "user is not found!");
    } else {
      return res.status(200).send({
        question: user[0].question
      });
    }
  }
);

module.exports = router;
