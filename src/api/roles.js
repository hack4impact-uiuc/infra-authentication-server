const router = require("express").Router();
const nodemailer = require("nodemailer");
const cors = require("cors");
const User = require("../models/User");
const bodyParser = require("body-parser");
const { sendResponse } = require("./../utils/sendResponse");
const { getRolesForUser } = require("./../utils/getConfigFile");
const jwt = require("jsonwebtoken");
var SECRET_TOKEN = "helga_has_n000000_idea_what_she_doin";

router.get("/roles", async function(req, res) {
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
  const roles = await getRolesForUser(user.role);
  let users = [];
  await Promise.all(
    roles.map(async role => {
      let usersWithRoles = await User.find({ role });
      for (i in usersWithRoles) {
        newUser = {
          email: usersWithRoles[i].email,
          role: usersWithRoles[i].role
        };
        users = users.concat(newUser);
      }
    })
  );
  return res.status(200).send({
    status: 200,
    message: "User's that you have the access rights to promote",
    user_emails: users
  });
});

module.exports = router;
