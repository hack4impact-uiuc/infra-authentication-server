const router = require("express").Router();
const { check, validationResult } = require("express-validator/check");
const User = require("../models/User");
const { sendResponse } = require("./../utils/sendResponse");
const { getRolesForUser } = require("./../utils/getConfigFile");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { SECRET_TOKEN } = require("../utils/secret-token");

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
      return sendResponse(res, 400, "Invalid Request", {
        errors: errors.array({ onlyFirstError: true })
      });
    }

    if (!req.headers.token) {
      return sendResponse(res, 400, "Token not provided");
    }
    let authenticationStatus = {};
    try {
      authenticationStatus = jwt.verify(req.headers.token, SECRET_TOKEN);
    } catch (e) {
      return sendResponse(res, 400, "Invalid Token");
    }

    const user = await User.findById(authenticationStatus.userId);
    if (!user) {
      sendResponse(res, 400, "User does not exist in the database");
      return;
    }

    let authenticated = false;
    if (await bcrypt.compare(req.body.password, user.password)) {
      // hash matches! sign a JWT with an expiration 1 day in the future and send back to the user
      authenticated = true;
    }

    const roles = await getRolesForUser(user.role);
    let userToBePromoted = await User.find({ email: req.body.userEmail });
    if (userToBePromoted.length === 0) {
      return sendResponse(res, 400, "User with that email doesn't exist");
    }
    userToBePromoted = userToBePromoted[0];
    // PR note: adding logic for promoting to higher level than yourself / demoting higher level user
    if (
      !!roles &&
      roles.indexOf(req.body.newRole) >= 0 &&
      roles.indexOf(userToBePromoted.role >= 0)
    ) {
      userToBePromoted.role = req.body.newRole;
      console.log("uh");
      await userToBePromoted.save();
      console.log("done");

      return sendResponse(
        res,
        200,
        "Sucessfully set new permission level for " +
          String(userToBePromoted.email) +
          " to " +
          String(userToBePromoted.role)
      );
    } else if (roles.indexOf(req.body.newRole) >= 0 && !authenticated) {
      return sendResponse(res, 400, "Incorrect Password");
    } else {
      return sendResponse(res, 400, "Incorrect Permission Levels");
    }
  }
);

module.exports = router;
