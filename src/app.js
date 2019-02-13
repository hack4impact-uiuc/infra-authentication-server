const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const User = require("./models/User");

const app = express();
app.use(cors());

app.get("/", function(req, res) {
  res.send("Hello World");
});

app.get("/users", async function(req, res) {
  const allUsers = await User.find();
  const names = allUsers.map(user => user.name);
  res.send(names);
});

app.get("/put/:name", function(req, res) {
  var user = new User({ username: req.params.name, passord:"demo" });
  user.save();
  console.log("Added User " + req.params.name);
  res.send("Added User " + req.params.name);
});

app.get("/login", async function(req, res) {
  const allUsers = await User.find();
  throwError = true;
  allUsers.forEach(function(user) {
    if (user.username === req.username){
      throwError = false;
      if(user.password === req.password){
        console.log("Welcome back " + req.username)
        res.send("Welcome back " + req.username)
      }
      else{
        console.log("Incorrect password")
        res.send("Incorrect password")
      }
    }
  })
  if (throwError) {
    console.log("Invalid username")
    res.send("Invalid username")
  }
})

app.listen(8000, function() {
  console.log("Listening on http://localhost:8000");
});