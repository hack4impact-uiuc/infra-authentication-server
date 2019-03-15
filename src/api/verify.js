const router = require("express").Router();
const User = require("../models/User");
const fetch = require("node-fetch");
const { sendResponse } = require("./../utils/sendResponse");
require("dotenv").config();

router.post("/verify", async function(req, res) {
  let authenticationStatus = {};
  try {
    authenticationStatus = jwt.verify(req.headers.token, SECRET_TOKEN);
  } catch (e) {
    return sendResponse(res, 400, "Invalid Token");
  }
  if (authenticationStatus) {
    return sendResponse(res, 200, "Successfully verified");
  }
});

module.exports = router;
