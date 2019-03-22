const router = require("express").Router();
const nodemailer = require("nodemailer");
const cors = require("cors");
const User = require("../models/User");
const bodyParser = require("body-parser");
const { sendResponse } = require("./../utils/sendResponse");
const { getRolesForUser } = require("./../utils/getConfigFile");
const jwt = require("jsonwebtoken");
const SECRET_TOKEN = "helga_has_n000000_idea_what_she_doin";

router.post("/roleschange", async function(req, res) {
  let status = 400;
  if (!req.headers.token) {
    return sendResponse(res, 400, "Token not provided");
  }
  status = 401;
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
  if (!req.body.userEmail || !req.body.newRole) {
    return sendResponse(res, 400, "Malformed Request");
  }
  const roles = await getRolesForUser(user.role);
  let userToBePromoted = await User.find({ email: req.body.userEmail });
  if (userToBePromoted.length === 0) {
    return sendResponse(res, 400, "User with that email doesn't exist");
  }
  userToBePromoted = userToBePromoted[0];
  if (roles.indexOf(req.body.newRole) >= 0) {
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
  } else {
    return sendResponse(res, 400, "Incorrect Permission Levels");
  }
});

module.exports = router;
