const router = require("express").Router();
const User = require("../models/User");
const fetch = require("node-fetch");
const { googleAuth } = require("./../utils/getConfigFile");
require("dotenv").config();

router.post("/google", async function(req, res) {
  const useGoogle = await googleAuth();
  if (!useGoogle)
    return res.status(400).send({
      status: 400,
      message: "Google authentication has been disabled"
    });
  if (!req.body) return res.sendStatus(400);

  const tokenInfoRes = await fetch(
    `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${
      req.body.tokenId
    }`
  );
  const payload = await tokenInfoRes.json();

  const user = await User.findOne({ email: payload.email, googleAuth: true });
  if (user) {
    console.log("Welcome back " + user.username);
    res.status(200).send({
      status: 200,
      message: "Successful login!"
    });
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
    res.status(200).send({
      status: 200,
      message: "New Google user: " + payload.email
    });
  }
});

module.exports = router;
