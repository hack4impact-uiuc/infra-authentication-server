const router = require("express").Router();
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator/check");
const User = require("../models/User");
const { sendResponse } = require("../utils/sendResponse");
const {
  signAuthJWT,
  verifyAuthJWT,
  decryptAuthJWT
} = require("../utils/jwtHelpers");

router.post(
  "/changePassword",
  [
    check("token")
      .custom(value => decryptAuthJWT(value) !== null)
      .withMessage("Invalid JWT"),
    check("currentPassword")
      .isString()
      .isLength({ min: 1 }),
    check("newPassword")
      .isString()
      .isLength({ min: 1 })
  ],
  async function(req, res) {
    // Input validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return sendResponse(res, 400, "Invalid request", {
        errors: errors.array({ onlyFirstError: true })
      });
    }

    var userId = decryptAuthJWT(req.headers.token);
    // Do a lookup by the decrypted user id
    let user;
    try {
      user = await User.findOne({ _id: userId });
    } catch (e) {
      return sendResponse(res, 500, e.message);
    }

    if (
      userId === null ||
      !verifyAuthJWT(req.headers.token, userId, user.password)
    ) {
      // error in decrypting JWT, so we can send back an invalid JWT message
      // could be expired or something else
      sendResponse(res, 400, "Invalid JWT token");
    } else if (user) {
      const oldPasswordMatches = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (oldPasswordMatches) {
        user.password = await bcrypt.hash(req.body.newPassword, 10);
        await user.save();
        var new_token = signAuthJWT(userId, user.password);
        sendResponse(res, 200, "Successful change of password!", {
          token: new_token
        });
      } else {
        sendResponse(res, 400, "Current password is incorrect");
      }
    } else {
      sendResponse(res, 400, "User does not exist.");
    }
  }
);

module.exports = router;
