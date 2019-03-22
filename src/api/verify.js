const router = require("express").Router();
const { check, validationResult } = require("express-validator/check");
const User = require("../models/User");
const { sendResponse } = require("./../utils/sendResponse");
const { decryptAuthJWT, verifyAuthJWT } = require("./../utils/jwtHelpers");

router.post(
  "/verify",
  [
    check("token")
      .isString()
      .isLength({ min: 1 })
  ],
  async function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
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
      sendResponse(res, 400, "Invalid JWT token");
    } else if (user) {
      return res.status(200).send({
        status: 200,
        message: "Valid JWT token",
        role: user.role
      });
    }
  }
);

module.exports = router;
