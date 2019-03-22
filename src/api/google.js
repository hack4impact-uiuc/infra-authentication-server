const router = require("express").Router();
const User = require("../models/User");
const fetch = require("node-fetch");
const { googleAuth } = require("./../utils/getConfigFile");
const { sendResponse } = require("./../utils/sendResponse");
require("dotenv").config();

router.post("/google", async function(req, res) {
  const useGoogle = await googleAuth();
  if (!useGoogle)
    return sendRespose(res, 400, "Google authentication has not be enabled");
  if (!req.body) return sendRespose(res, 400, "Invalid request");

  const tokenInfoRes = await fetch(
    `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${
      req.body.tokenId
    }`
  );
  const payload = await tokenInfoRes.json();

  const user = await User.findOne({ email: payload.email, googleAuth: true });
  if (user) {
    console.log("Welcome back " + user.username);
    sendResponse(res, 200, "Successful login!");
  } else {
    const user = new User({
      email: payload.email,
      username: payload.name,
      password: null,
      googleAuth: true,
      userLevel: "generalUser"
    });
    await user.save().then(user => {
      console.log("Google user added successfully");
    });
    sendResponse(res, 200, "New Google user: " + payload.email);
  }
});

module.exports = router;
