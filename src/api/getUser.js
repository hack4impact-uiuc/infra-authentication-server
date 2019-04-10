const router = require("express").Router();
const { check, validationResult } = require("express-validator/check");
const User = require("../models/User");
const { sendResponse } = require("./../utils/sendResponse");
const jwt = require("jsonwebtoken");
const { SECRET_TOKEN } = require("../utils/secret-token");
const fetch = require("node-fetch");

router.get(
  "/getUser",
  check("token")
    .isString()
    .isLength({ min: 1 }),
  async function(req, res) {
    // Input validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendResponse(res, 400, "Invalid request", {
        errors: errors.array({ onlyFirstError: true })
      });
    }
    let user = null;
    let authenticationStatus = {};
    if (req.headers.google === "undefined") {
      try {
        authenticationStatus = jwt.verify(req.headers.token, SECRET_TOKEN);
      } catch (e) {
        return sendResponse(res, 400, "Invalid Token");
      }
      user = await User.findById(authenticationStatus.userId);
      if (!user) {
        sendResponse(res, 400, "User does not exist in the database");
        return;
      }
    } else {
      const tokenInfoRes = await fetch(
        `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${
          req.headers.token
        }`
      );
      const payload = await tokenInfoRes.json();
      user = await User.findOne({ email: payload.email, googleAuth: true });
      if (!user) {
        sendResponse(res, 400, "User does not exist in the database");
        return;
      }
    }
    return res.status(200).send({
      status: 200,
      message: "User succesfully returned",
      user_email: user.email,
      user_verified: user.verified || req.headers.google,
      user_role: user.role
    });
  }
);

module.exports = router;
