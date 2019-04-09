const router = require("express").Router();
const { check, validationResult } = require("express-validator/check");
const User = require("../models/User");
const { sendResponse } = require("./../utils/sendResponse");
const { decryptAuthJWT, verifyAuthJWT } = require("./../utils/jwtHelpers");
const { googleAuth } = require("./../utils/getConfigFile");
const fetch = require("node-fetch");
const handleAsyncErrors = require("../utils/errorHandler");

router.post(
  "/verify",
  [
    check("token")
      .isString()
      .isLength({ min: 1 })
  ],
  handleAsyncErrors(async function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendResponse(res, 400, "Invalid request", {
        errors: errors.array({ onlyFirstError: true })
      });
    }

    const useGoogle = await googleAuth();
    if (useGoogle) {
      const tokenInfoRes = await fetch(
        `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${
          req.headers.token
        }`
      );
      const payload = await tokenInfoRes.json();
      const user = await User.findOne({
        email: payload.email,
        googleAuth: true
      });
      if (user) {
        return sendResponse(res, 200, "Google Authenticated");
      } else {
        null;
      }
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
  })
);

module.exports = router;
