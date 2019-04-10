const router = require("express").Router();
const { check, validationResult } = require("express-validator/check");
const User = require("../models/User");
const { sendResponse } = require("./../utils/sendResponse");
const { getRolesForUser } = require("./../utils/getConfigFile");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { SECRET_TOKEN } = require("../utils/secret-token");
const fetch = require("node-fetch");

router.post(
  "/roleschange",
  [
    check("userEmail").isEmail(),
    check("newRole")
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

    if (!req.headers.token) {
      return sendResponse(res, 400, "Token not provided");
    }
    let user = null;
    let authenticated = false;
    if (req.headers.google === "undefined") {
      let authenticationStatus = {};
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
      if (await bcrypt.compare(req.body.password, user.password)) {
        // hash matches! sign a JWT with an expiration 1 day in the future and send back to the user
        authenticated = true;
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
      authenticated = true;
    }
    const roles = await getRolesForUser(user.role);
    let userToBePromoted = await User.find({ email: req.body.userEmail });
    if (userToBePromoted.length === 0) {
      return sendResponse(res, 400, "User with that email doesn't exist");
    }
    userToBePromoted = userToBePromoted[0];
    if (roles.indexOf(req.body.newRole) >= 0 && authenticated) {
      userToBePromoted.role = req.body.newRole;
      await userToBePromoted.save();
      return sendResponse(
        res,
        200,
        "Sucessfully set new permission level for " +
          String(userToBePromoted.email) +
          " to " +
          String(userToBePromoted.role)
      );
    } else if (roles.indexOf(req.body.newRole) >= 0 && !authenticated) {
      return sendResponse(res, 400, "Incorrect Authentication");
    } else {
      return sendResponse(res, 400, "Incorrect Permission Levels");
    }
  }
);

module.exports = router;
