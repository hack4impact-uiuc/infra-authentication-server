const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const { sendResponse } = require("../utils/sendResponse");
const {
  signAuthJWT,
  verifyAuthJWT,
  decryptAuthJWT
} = require("../utils/jwtHelpers");

router.post("/changePassword", async function(req, res) {
  if (!req.body || !req.headers.token || !req.body.password) {
    sendResponse(res, 400, "Malformed Request");
    return;
  }
  var userId = decryptAuthJWT(req.headers.token);
  // Do a lookup by the decrypted user id
  const user = await User.findOne({ _id: userId }).catch(e => console.log(e));

  if (
    userId === null ||
    !verifyAuthJWT(req.headers.token, userId, user.password)
  ) {
    // error in decrypting JWT, so we can send back an invalid JWT message
    // could be expired or something else
    sendResponse(res, 400, "Invalid JWT token");
  } else if (user) {
    user.password = await bcrypt.hash(req.body.password, 10);
    await user.save();
    var new_token = signAuthJWT(userId, user.password);
    sendResponse(res, 200, "Successful change of password!", {
      token: new_token
    });
  } else {
    sendResponse(res, 400, "User does not exist.");
  }
});

module.exports = router;
