const express = require("express");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/User");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
  res.send("Hello World");
});

app.post("/auth", async function(req, res) {
  console.log("auth");
  res.send({ result: "success", token: "magic" });
});

app.get("/users", async function(req, res) {
  const allUsers = await User.find();
  const names = allUsers.map(user => user.username);
  res.send(names);
});

app.get("/put/:name", function(req, res) {
  var user = new User({ username: req.params.name, passord: "demo" });
  user.save();
  console.log("Added User " + req.params.name);
  res.send("Added User " + req.params.name);
});

app.get("/register", function(req, res) {
  res.send(
    "this is /register, where you can put your information in a form to create an account"
  );
});

app.post("/register", async function(req, res, next) {
  if (!req.body) return res.sendStatus(400);
  const user = new User(req.body);
  await user.save().then(user => {
    console.log("User added successfully");
  });
  res.send("email: " + req.body.email + "\nusername: " + req.body.username);
});

app.post("/forgotPassword", async function(req, res) {
  const user = await User.findOne({ email: req.body.email }).catch(e =>
    console.log(e)
  );
  console.log(user.expiration);
  // TODO: handle the config file change in security question
  if (
    user &&
    req.body.answer &&
    user.answer === req.body.answer.toLowerCase()
  ) {
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
      message: "User does not exist in the DB."
    });
  }
});

app.post("/passwordReset", async function(req, res) {
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
  if (user.pin != req.body.pin) {
    res.send({
      status: 400,
      message: "PIN does not match"
    });
    return;
  }
  if (user.expiration.getTime() < new Date().getTime()) {
    res.send({
      status: 400,
      message: "PIN is expired"
    });
    return;
  }
  //user matches, change expiration
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
});

app.post("/getSecurityQuestion", async function(req, res) {
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

app.listen(8000, function() {
  console.log("Listening on http://localhost:8000");
});
