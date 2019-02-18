const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = requre("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: false })

const User = require("./models/User");

const app = express();
app.use(cors());

app.get("/", function(req, res) {
  res.send("Hello World");
});

app.post("/auth", async function(req, res) {
  console.log("auth")
  res.send({"result":"success","token": "magic"})
});

app.get("/users", async function(req, res) {
  const allUsers = await User.find();
  const names = allUsers.map(user => user.username);
  res.send(names);
});

app.get("/put/:name", function(req, res) {
  var user = new User({ username: req.params.name, passord:"demo" });
  user.save();
  console.log("Added User " + req.params.name);
  res.send("Added User " + req.params.name);
});

app.get("/signup",  function(req, res) {
  res.render("SignUp", {title: "Create an account with us!"});
  res.send("this is /signup, where you can create an account");
});

app.post("/signup", urlencodedParser, async function(req, res, next) {
  if (!req.body) return res.sendStatus(400);
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  console.log({"email": email, "username": username});
  res.send({"status": 200, "message": "User account successfully created"})
  // res.redirect("/login") // supposedly the login page to enter account credentials to get to /login/:username/:password
});

app.listen(8000, function() {
  console.log("Listening on http://localhost:8000");
});