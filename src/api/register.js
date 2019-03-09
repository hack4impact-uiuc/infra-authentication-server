const router = require("express").Router();
const cors = require("cors");
const jwt = require("jsonwebtoken");

var SECRET_TOKEN = "helga_has_n000000_idea_what_she_doin";
const User = require("../models/User");
const bodyParser = require("body-parser");
const { sendResponse } = require("./../utils/sendResponse");
const { getRolesForUser } = require("./../utils/getConfigFile");

router.post("/register", async function(req, res) {
  if (!req.body.email || !req.body.password || !req.body.role) {
    return sendResponse(
      res,
      400,
      "Please enter valid arguments for the fields provided."
    );
  }

  if (await User.findOne({ email: req.body.email })) {
    return sendResponse(res, 400, "User already exists. Please try again.");
  }

  const encodedPassword = jwt.sign(
    { password: req.body.password },
    SECRET_TOKEN
  );
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

  const jwt_token = jwt.sign({ userId: user._id }, SECRET_TOKEN);
  await user.save().then(user => {
    console.log("User added successfully");
  });
  return res.status(200).send({
    status: 200,
    message: "User added successfully!",
    token: jwt_token,
    uid: user._id,
    permission: user.role
  });
});

module.exports = router;
