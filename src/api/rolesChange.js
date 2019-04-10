const router = require("express").Router();
const { check, validationResult } = require("express-validator/check");
const User = require("../models/User");
const { sendResponse } = require("./../utils/sendResponse");
const { getRolesForUser } = require("./../utils/getConfigFile");
const bcrypt = require("bcrypt");
const fetch = require("node-fetch");
const handleAsyncErrors = require("../utils/errorHandler");
const { verifyUser } = require("./../utils/userVerification");

router.post(
  "/roleschange",
  [
    check("userEmail").isEmail(),
    check("newRole")
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

    let user = await verifyUser(req.headers.token);
    console.log(user);
    if (user.errorMessage != null) {
      return sendResponse(res, 400, user.errorMessage);
    }

    let authenticated = false;

    if (req.headers.google === undefined) {
      console.log("HERE");
      if (await bcrypt.compare(req.body.password, user.password)) {
        authenticated = true;
      }
    } else {
      console.log("HERE2");
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
    console.log("authenticated");
    console.log(authenticated);
    console.log(req.headers.google);
    const roles = await getRolesForUser(user.role);
    console.log(req.body.userEmail);
    let userToBePromoted = await User.find({ email: req.body.userEmail });
    console.log(userToBePromoted);
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
  })
);

module.exports = router;
