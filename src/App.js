const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
var bodyParser = require('body-parser');
const User = require("./models/User");
const configParse = require('./utils/config-helpers')

/*
  Before init the app: 
    go through the configuration file and initialize the global vars.

*/
global.roles = {}
const configRet = configParse()
if (!configRet.success) {
  console.log(configRet.error)
  throw new Error(configRet.error)
}

const app = express();
app.use(cors());
app.use(bodyParser.json());


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
  const names = allUsers.map(user => user);
  res.send(names);
});

app.get('/roles', async function (req, res) {
  if (!req.headers.token) { res.send({ error: 'token not provided' }) }
  const authenticated = await verifyJWT(req.headers.token)
  // only allow super admin or second level admin?
  if (!authenticated.success) {
    if (!!authenticated.error) {
      res.send({ error: authenticated.error })
    } else {
      res.send({ error: 'Unable to Authenticate' })
    }
  } else {
    const { list: rolesList, dict: rolesDict } = global.roles
    if (authenticated.success && rolesDict[rolesList[1]] >= rolesDict[authenticated.userLevel]) {
      res.send({ roles: rolesList })
    } else {
      res.send({ error: 'You do not have the role to view this' })
    }
  }
})

app.post("/roleschange", async function (req, res) {
  if (!req.headers.token) { res.send({ error: 'token not provided' }) }
  const authenticated = verifyJWT(req.headers.token)
  const { dict: rolesDict } = global.roles
  if (authenticated.success) {
    const { userLevel } = authenticated
    const { usersToLevelChange } = req.body
    if (!usersToLevelChange) {
      res.send({ error: 'No data provided' })
    } else {
      const failedPromotions = []
      Object.keys(usersToLevelChange).forEach(async (user) => {
        const levelToChange = usersToLevelChange[user]
        console.log(levelToChange)
        if (!!rolesDict[levelToChange] && rolesDict[levelToChange] >= rolesDict[userLevel]) {
          const levelChangeOutcome = await levelChange(user, levelToChange)
          console.log(levelChangeOutcome)
          if (!levelChangeOutcome.success) {
            failedPromotions.push(user)
          }
        } else {
          failedPromotions.push(user)
        }
      })
      if (!!failedPromotions.length) {
        res.send({
          error: 'the following users were failed to be granted privileges for the following reason(s): input of incorrect userID / input of incorrect userLevel'
          , failedPromotions
        })
      } else {
        res.send({ message: 'all user level changes granted' })
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

app.get("/put/:level", function (req, res) {
  var user = new User({ username: 'nithins2', password: "demo", userLevel: req.params.level });
  user.save();
  console.log("Added User " + req.params.level);
  res.send("Added User " + req.params.level);
});

/*
  returns
  authenticated = {
    success: boolean,
    error (optional): str,
    userLevel: one of keys in validLevels
  }
*/
const verifyJWT = async(id) => {
  console.log(userID, 'nithin')
  User.findById(id, function (err, doc) {
    console.log(id)
    console.log(doc.userLevel)
    if (err) {
      return {
        success: false,
        userLevel: 'generalUser'
      }
    }
    return {
      success: true,
      userLevel: doc.userLevel
    }
  })
}

const levelChange = async (userID, level) => {
  User.findById(userID, function (err, user) {
    console.log(userID, 'level change')
    if (err) {
      return { success: false, message: err }
    }
    user.userLevel = level
    user.save();
    console.log(`${userID} level changed to ${level}`)
    return { success: true }
  });
}