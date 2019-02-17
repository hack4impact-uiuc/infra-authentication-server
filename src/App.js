const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
var bodyParser = require('body-parser');
const User = require("./models/User");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const superAdmin = 'superAdmin'
const generalUser = 'generalUser'
const validLevels = {
  [superAdmin]: -1,
  [generalUser]: 0
}

app.listen(8000, function () {
  console.log("Listening on http://localhost:8000");
});

app.get("/", function (req, res) {
  res.send("Hello World");
});

app.post("/auth", async function (req, res) {
  console.log("auth")
  res.send({ "result": "success", "token": "magic" })
});

app.get("/users", async function (req, res) {
  const allUsers = await User.find();
  const names = allUsers.map(user => user.username);
  res.send(names);
});

app.post("/levelchange", async function (req, res) {
  if (!req.headers.token) { res.send({ error: 'token not provided' }) }
  const authenticated = verifyJWT(req.headers.token)
  if (authenticated.success) {
    const { userLevel } = authenticated
    const { usersToLevelChange } = req.body
    if(!usersToLevelChange) {
      res.send({error: 'No data provided'})
    } else {
      const failedPromotions = []
      Object.keys(usersToLevelChange).forEach((user) => {
        const levelToChange = usersToLevelChange[user]
        // the lower the integer value returned by validLevels the higher the level
        if(!!validLevels[levelToChange] && validLevels[levelToChange] >= validLevels[userLevel]) {
          levelChange(user, levelToChange)
        } else {
          failedPromotions.push(user)
        }
      })
      console.log(failedPromotions)
      if(!!failedPromotions.length) {
        res.send({ error: 'the following users were failed to be granted privileges for the following reason(s): input of incorrect userID / input of incorrect userLevel'
        , failedPromotions})
      } else {
        res.send({message: 'all user level changes granted'})
      }
    }
  } else {
    if (!!authenticated.error) {
      res.send({ error: authenticated.error })
    } else {
      res.send({ error: 'Unable to Authenticate' })
    }
  }
})

app.get("/put/:name", function (req, res) {
  var user = new User({ username: req.params.name, passord: "demo" });
  user.save();
  console.log("Added User " + req.params.name);
  res.send("Added User " + req.params.name);
});

/*
  returns
  authenticated = {
    success: boolean,
    error (optional): str,
    userLevel: one of keys in validLevels
  }
*/
const verifyJWT = (token) => {
  // i mean here someone would do some bullshit to the token like authenticating it and grabbing data from it
  return {
    success: true,
    userLevel: superAdmin
  }
}
const levelChange = (userID, level) => {
  console.log(`${userID} level changed to ${level}`)
}