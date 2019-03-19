const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const { sendResponse } = require("./../utils/sendResponse");
const { getRolesForUser } = require("./../utils/getConfigFile");
const { signAuthJWT } = require("../utils/jwtHelpers");

router.post("/register", async function(req, res) {
  if (!req.body.email || !req.body.password || !req.body.role) {
    return sendResponse(
      res,
      400,
      "Please enter valid arguments for the fields provided."
    );
  }
  const u = await User.findOne({ email: req.body.email });

  if (await User.findOne({ email: req.body.email })) {
    return sendResponse(res, 400, "User already exists. Please try again.");
  }

  const encodedPassword = await bcrypt.hash(req.body.password, 10);

  const userData = {
    email: req.body.email,
    password: encodedPassword,
    role: req.body.role
  };
  const user = new User(userData);
  const requiredAuthFrom = await getRolesForUser(req.body.role);

  if (requiredAuthFrom != null) {
    return sendResponse(
      res,
      400,
      "User needs a higher permission level for that role"
    );
  }

  const jwt_token = signAuthJWT(user._id, user.password);
  await user.save();
  return res.status(200).send({
    status: 200,
    message: "User added successfully!",
    token: jwt_token,
    uid: user._id,
    permission: user.role
  });
});

module.exports = router;
