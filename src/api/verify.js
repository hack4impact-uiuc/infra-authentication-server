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
    var userId = decryptAuthJWT(req.body.token);
    // Do a lookup by the decrypted user id
    const user = await User.findOne({ _id: userId }).catch(e => console.log(e));
    if (
      userId === null ||
      !verifyAuthJWT(req.body.token, userId, user.password)
    ) {
      console.log(req.body.token);
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
