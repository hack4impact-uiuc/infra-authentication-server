const express = require("express");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const User = require("./models/User");
const fetch = require("node-fetch");
const app = express();
require("dotenv").config();
const jwt = require("jsonwebtoken");
const exjwt = require("express-jwt");

// var SECRET_TOKEN = process.env.SECRET_TOKEN;
var SECRET_TOKEN = "helga_has_n000000_idea_what_she_doin";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const router = require("./api/password-reset.js");

app.use("/", router);

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
  var user = new User({ username: req.params.name, password: "demo" });
  user.save();
  console.log("Added User " + req.params.name);
  res.send("Added User " + req.params.name);
});

app.post("/post/google", async function(req, res) {
  if (!req.body) return res.sendStatus(400);

  const tokenInfoRes = await fetch(
    `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${
      req.body.tokenId
    }`
  );
  const payload = await tokenInfoRes.json();

  const user = await User.find({ email: payload.email, googleAuth: true });
  if (user.length != 0) {
    console.log("Welcome back " + user[0].username);
    res.send("Welcome back " + user[0].username);
  } else {
    const user = new User({
      email: payload.email,
      username: payload.name,
      password: null,
      googleAuth: true
    });
    await user.save().then(user => {
      console.log("Google user added successfully");
    });
    res.send("email: " + payload.email);
  }
});

app.listen(8000, function() {
  console.log("Listening on http://localhost:8000");
});

app.post("/register", async function(req, res, next) {
  // no email or password provided --> invalid
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({
      status: 400,
      message: "Please enter valid arguments for the fields provided."
    });
  }

  // email already in database --> invalid
  if (await User.findOne({ email: req.body.email })) {
    return res.status(400).send({
      status: 400,
      message: "User already exists. Please try again."
    });
  }

  // create user with given form input data
  /**
   * {
   *    //uuid: automatically done in when sent to db? i think
   *    email: string,
   *    token: string, generated in a more secure way than what i have rn lol
   * }
   */
  // token generated with email and password with our "secret_token"
  const jwt_token = jwt.sign(
    { email: req.body.email, password: req.body.password },
    SECRET_TOKEN
  );
  const user_data = {
    email: req.body.email,
    password: jwt_token
  };
  const user = new User(user_data);
  await user.save().then(user => {
    console.log("User added successfully");
  });
  return res.status(200).send({
    status: 200,
    message: "User added successfully!",
    token: jwt_token
  });
});

app.post("/login", async function(req, res) {
  // no email or password provided --> invalid
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({
      status: 400,
      message: "Please enter valid arguments for the fields provided."
    });
  }
  // un-jwt-ify the given password, see if it's a match with the token associated with the email.
  var user = await User.findOne({ email: req.body.email });
  if (user) {
    var decoded = jwt.verify(user.password, SECRET_TOKEN, {
      password: req.body.password
    });
    if (req.body.password === decoded.password) {
      return res.status(200).send({
        status: 200,
        message: "Successful login!",
        token: user.password
      });
    } else {
      return res.status(400).send({
        status: 400,
        message: "Passwword incorrect. Please try again."
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

app.post("/forgotPassword", async function(req, res) {
  const user = await User.findOne({ email: req.body.email }).catch(e =>
    console.log(e)
  );
});

module.exports = { app };
