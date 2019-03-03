const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser")
const User = require("./models/User");
const fetch = require("node-fetch")

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
  res.send("Hello World");
});

app.get("/users", async function(req, res) {
  const allUsers = await User.find();
  const names = allUsers.map(user => user.username);
  res.send(names);
});

app.get("/put/:name", function(req, res) {
  var user = new User({ username: req.params.name, password:"demo" });
  user.save();
  console.log("Added User " + req.params.name);
  res.send("Added User " + req.params.name);
});

app.post("/post/google", async function(req, res) {
  if (!req.body) return res.sendStatus(400)

  const tokenInfoRes = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${req.body.tokenId}`)
  const payload = await tokenInfoRes.json()

  const user = await User.find({email: payload.email, googleAuth: true})
  if (user.length != 0){
      console.log("Welcome back " + user[0].username)
      res.send("Welcome back " + user[0].username)
  }
  else{
    const user = new User({
      email: payload.email,
      username: payload.name,
      password: null,
      googleAuth: true
    });
    await user.save().then(user => {
      console.log("Google user added successfully")
    })
    res.send("email: " + payload.email)
  }
});

app.listen(8000, function() {
  console.log("Listening on http://localhost:8000");
});