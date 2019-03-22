const router = require("express").Router();
const User = require("../models/User");
const { sendResponse } = require("./../utils/sendResponse");
const { decryptAuthJWT, verifyAuthJWT } = require("./../utils/jwtHelpers");

router.post("/verify", async function(req, res) {
  var userId = decryptAuthJWT(req.headers.token);
  console.log(req.headers.tokens);
  // Do a lookup by the decrypted user id
  const user = await User.findOne({ _id: userId }).catch(e => console.log(e));
  if (
    userId === null ||
    !verifyAuthJWT(req.headers.token, userId, user.password)
  ) {
    sendResponse(res, 400, "Invalid JWT token");
  } else if (user) {
    return res.status(200).send({
      status: 200,
      message: "Valid JWT token",
      role: user.role
    });
  }
});

module.exports = router;
