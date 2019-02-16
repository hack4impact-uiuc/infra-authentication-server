const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

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

app.get("signup", async function(req, res) {

});

app.listen(8000, function() {
  console.log("Listening on http://localhost:8000");
});