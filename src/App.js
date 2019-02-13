const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
<<<<<<< HEAD
const bodyParser = require("body-parser");

=======
>>>>>>> added forgot route
const User = require("./models/User");
var bodyParser = require('body-parser')
const app = express();

app.use(bodyParser.urlencoded())
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const msg = {
  to: 'test@example.com',
  from: 'test@example.com',
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};

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

app.get("/register",  function(req, res) {
  res.send("this is /register, where you can put your information in a form to create an account");
});

app.post("/register", async function(req, res, next) {
  if (!req.body) return res.sendStatus(400);
  const user = new User(req.body);
  await user.save()
    .then(user => {
       console.log("User added successfully");
    });
  res.send("email: " + req.body.email + "\nusername: " + req.body.username);
});
app.post("/forgot/", async function (req, res) {
  console.log(req.body);
  const user = await User.findOne({ email: req.body.email }).catch(e => console.log(e));
  if (user) {
    //user found, update pin
    user.pin = Math.floor(Math.random() * (100000000 - 100000 + 1)) + 100000;
    var date = new Date();
    // add a day to the current date
    date.setDate(date.getDate() + 1);
    user.expiration = date;
    console.log(user);
    await user.save();
  }
  res.send({ "status": 200, "message": "user updated" });
});


app.listen(8000, function() {
  console.log("Listening on http://localhost:8000");
});
