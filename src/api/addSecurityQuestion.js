const router = require("express").Router();
const User = require("../models/User");
const { check, validationResult } = require("express-validator/check");
const { sendResponse } = require("./../utils/sendResponse");
const bcrypt = require("bcrypt");

const { verifyUser } = require("./../utils/userVerification");
router.post(
  "/addSecurityQuestion",
  [
    check("question")
      .isString()
      .isLength({ min: 1 }),
    check("answer")
      .isString()
      .isLength({ min: 1 })
  ],
  async function(req, res) {
    // Input validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendResponse(res, 400, "Invalid request", {
        errors: errors.array({ onlyFirstError: true })
      });
    }

    const user = await verifyUser(req.headers.token);
    if (user.errorMessage != null) {
      return sendResponse(res, 400, user.errorMessage);
    }

    let authenticated = false;
    if (await bcrypt.compare(req.body.password, user.password)) {
      // hash matches! sign a JWT with an expiration 1 day in the future and send back to the user
      authenticated = true;
    }
    if (!authenticated) {
      return sendResponse(res, 400, "Incorrect Password");
    }
    await User.updateOne(
      { _id: user._id },
      {
        question: req.body.question,
        answer: req.body.answer.toLowerCase().replace(/\s/g, "")
      }
    );
    sendResponse(res, 200, "Succesfully added the security question");
  }
);

module.exports = router;
