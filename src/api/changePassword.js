const router = require("express").Router();
const nodemailer = require("nodemailer");
const cors = require("cors");
const User = require("../models/User");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const exjwt = require("express-jwt");
const { sendResponse } = require("../utils/sendResponse");
const {
  signAuthJWT,
  hashPassword,
  verifyPasswordHash,
  verifyAuthJWT,
  decryptAuthJWT
} = require("../utils/jwtHelpers");

router.post("/changePassword", async function(req, res) {
  if (!req.body || !req.body.token || !req.body.password) {
    sendResponse(res, 400, "Request doesn't contain token or password");
    return;
  }
  var userId = decryptAuthJWT(req.body.token);

  if (userId === null) {
    // error in decrypting JWT, so we can send back an invalid JWT message
    // could be expired or something else
    sendResponse(res, 400, "Invalid JWT token");
  }

  // Do a lookup by the decrypted user id
  const user = await User.findOne({ _id: userId }).catch(e => console.log(e));
  if (user) {
    var new_token = signAuthJWT(userId);
    user.password = hashPassword(req.body.password);
    await user.save();
    sendResponse(res, 200, "Successful change of password!", {
      token: new_token
    });
  } else {
    sendResponse(
      res,
      400,
      "The user does not exist. Please check your inputs again."
    );
  }
});

module.exports = router;
