const router = require("express").Router();
const User = require("../models/User");
const fetch = require("node-fetch");
const { sendResponse } = require("./../utils/sendResponse");
var SECRET_TOKEN = "helga_has_n000000_idea_what_she_doin";

router.post("/verify", async function(req, res) {
  let authenticationStatus = {};
  try {
    authenticationStatus = jwt.verify(req.body.token, SECRET_TOKEN);
  } catch (e) {
    return sendResponse(res, 400, "Invalid Token");
  }
  if (authenticationStatus) {
    return sendResponse(res, 200, "Successfully verified");
  }
});

module.exports = router;
