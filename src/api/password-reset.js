const router = require("express").Router();
const nodemailer = require("nodemailer");
const cors = require("cors");
const User = require("../models/User");
const bodyParser = require("body-parser");

router.post("/forgotPassword", async function(req, res) {
  const user = await User.findOne({ email: req.body.email }).catch(e =>
    console.log(e)
  );
  console.log(user.expiration);
  // TODO: handle the config file change in security question
  if (!user) {
    res.send({
      status: 400,
      message: "User does not exist in the DB."
    });
    return;
  }
  if (req.body.answer && user.answer === req.body.answer.toLowerCase()) {
    //user found, update pin
    user.pin = Math.floor(Math.random() * (100000000 - 100000 + 1)) + 100000;
    var date = new Date();
    // add a day to the current date
    date.setDate(date.getDate() + 1);
    user.expiration = date;
    await user.save();
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.INFRA_EMAIL,
        clientId: process.env.INFRA_CLIENT_ID,
        clientSecret: process.env.INFRA_CLIENT_SECRET,
        refreshToken: process.env.INFRA_REFRESH_TOKEN
      }
    });
    console.log("Created transport with nodemailer");
    transporter
      .sendMail({
        from: "hack4impact.infra@gmail.com",
        to: user.email,
        subject: "Forgot Password",
        text: "Enter the following pin on the reset page: " + user.pin
      })
      .catch(e => {
        console.log(e);
        res.send({
          status: 500,
          message:
            "An internal server error occured and the email could not be sent."
        });
      });
    res.send({
      status: 200,
      message: "Sent password reset PIN to user if they exist in the database."
    });
  } else {
    res.send({
      status: 400,
      message: "No answer specified."
    });
  }
});

router.post("/passwordReset", async function(req, res) {
  console.log(req.body);
  if (!req.body || !req.body.email) {
    console.log("HERE");
    res.status(400).send({
      status: 400,
      message: "Malformed request"
    });
    return;
  }
  const user = await User.findOne({ email: req.body.email }).catch(e =>
    console.log(e)
  );
  if (!user) {
    res.send({
      status: 400,
      message: "User does not exist in the database"
    });
    return;
  }
  if (user.pin && user.pin != req.body.pin) {
    res.send({
      status: 400,
      message: "PIN does not match"
    });
    return;

    console.log(user.expiration.getTime());
    console.log(new Date().getTime());
    if (user.expiration && user.expiration.getTime() < new Date().getTime()) {
      res.send({
        status: 400,
        message: "PIN is expired"
      });
      return;
    }
    // user matches, change expiration
    var date = new Date();
    // remove a day to the current date to expire it
    // set date to 24 hours before because we don't want
    // concurrent requests happening in the same second to both go through
    // (i.e. if the user presses change password button twice)
    date.setDate(date.getDate() - 1);
    user.expiration = date;
    user.password = req.body.password;
    await user.save();

    res.send({
      status: 200,
      message: "Password successfully reset"
    });
  }
});

router.post("/getSecurityQuestion", async function(req, res) {
  const user = await User.findOne({ email: req.body.email }).catch(e => {
    console.log(e);
  });
  if (!user) {
    res.send({
      status: 400,
      message: "User does not exist in the database"
    });
    return;
  }
  if (!user.question) {
    res.send({
      status: 400,
      message: "No security question set"
    });
    return;
  }
  res.send({
    status: 200,
    question: user.question
  });
});

module.exports = router;
