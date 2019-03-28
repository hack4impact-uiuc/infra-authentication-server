const router = require("express").Router();
// const bcrypt = require("bcrypt");
const User = require("../models/User");
const { check, validationResult } = require("express-validator/check");
const { sendResponse } = require("./../utils/sendResponse");
const { decryptAuthJWT } = require("../utils/jwtHelpers");

router.post(
  "/addSecurityQuestion",
  [
    check("token")
      .custom(value => decryptAuthJWT(value) !== null)
      .withMessage("Invalid JWT"),
    // check("question_password")
    //   .isString()
    //   .isLength({ min: 1 }),
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
    const userId = decryptAuthJWT(req.headers.token);
    var user = await User.findOne({ _id: userId });
    // var password_match = await bcrypt.compare(
    //   req.body.question_password,
    //   user.password
    // );
    if (user) {
      await User.updateOne(
        { _id: user._id },
        {
          question: req.body.question,
          answer: req.body.answer.toLowerCase().replace(/\s/g, "")
        }
      );
      console.log("successfully added");
      sendResponse(res, 200, "Succesfully added the security question");
    } else {
      console.log("user doesnt exist");
      sendResponse(res, 400, "User doesn't exist");
    }
  }
);

module.exports = router;
