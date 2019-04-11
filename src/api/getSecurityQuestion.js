const router = require("express").Router();
const { check, validationResult } = require("express-validator/check");
const { sendResponse } = require("./../utils/sendResponse");
const { getSecurityQuestions } = require("../utils/getConfigFile");
const jwt = require("jsonwebtoken");
const { SECRET_TOKEN } = require("../utils/secret-token");
const fetch = require("node-fetch");
const User = require("../models/User");

router.get(
  "/getSecurityQuestions",
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
    let authenticationStatus;
    // this logic is copy + pasted from roles.js, we should prob put this into a function
    if (req.headers.google === undefined) {
      try {
        authenticationStatus = jwt.verify(req.headers.token, SECRET_TOKEN);
      } catch (e) {
        return sendResponse(res, 400, "Invalid Token");
      }
      let user = await User.findById(authenticationStatus.userId);
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

      let user = await User.findOne({
        email: payload.email,
        googleAuth: true
      });
      if (!user) {
        sendResponse(res, 400, "User does not exist in the database");
        return;
      }
    }
    const questionsResponse = await getSecurityQuestions();
    if (!questionsResponse.success) {
      return sendResponse(
        res,
        500,
        "No security question could be parsed from config file"
      );
    } else {
      return res.status(200).send({
        questions: questionsResponse.securityQuestions
      });
    }
  }
);

module.exports = router;
