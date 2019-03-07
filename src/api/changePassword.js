const router = require("express").Router();
const nodemailer = require("nodemailer");
const cors = require("cors");
const User = require("../models/User");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const exjwt = require("express-jwt");
const { SECRET_TOKEN } = require("../utils/secret-token");

router.post("/changePassword", async function(req, res) {
  if (!req.body || !req.body.email || !req.body.token || !req.body.password) {
    sendMalformedRequest(res);
    return;
  }

  const user = await User.findOne({ email: req.body.email }).catch(e =>
    console.log(e)
  );
  if (user) {
    var new_token = jwt.sign(
      { email: req.body.email, password: req.body.password },
      SECRET_TOKEN
    );
    if (user.email === req.body.email && req.body.token === user.password) {
      user.password = new_token;
      user.save();
      return res.status(200).send({
        status: 200,
        message: "Successful change of password!",
        token: new_token
      });
    } else {
      return res.status(400).send({
        status: 400,
        message: "Username or password incorrect. Please try again."
      });
    }
  } else {
    return res.status(400).send({
      status: 400,
      message:
        "The information you provided does not match our database. Please check your inputs again."
    });
  }
});
module.exports = router;
