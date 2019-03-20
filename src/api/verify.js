const router = require("express").Router();
const User = require("../models/User");
const fetch = require("node-fetch");
const { sendResponse } = require("./../utils/sendResponse");
var SECRET_TOKEN = "helga_has_n000000_idea_what_she_doin";

router.post("/verify", async function(req, res) {
  var userId = decryptAuthJWT(req.body.token);
  // Do a lookup by the decrypted user id
  const user = await User.findOne({ _id: userId }).catch(e => console.log(e));
  if (
    userId === null ||
    !verifyAuthJWT(req.body.token, userId, user.password)
  ) {
    sendResponse(res, 400, "Invalid JWT token");
  } else if (user) {
    sendResponse(res, 200, "Valid JWT token");
  }
});

module.exports = router;
