const express = require("express");

const cors = require("cors");
var bodyParser = require("body-parser");
const User = require("./models/User");
const { parseConfig } = require("./utils/config-helpers");

/*
  Before init the app: 
    go through the configuration file and initialize the global vars.

*/
global.roles = {};
const configRet = parseConfig();
if (!configRet.success) {
  throw new Error(configRet.error);
}

const app = express();

app.use(bodyParser.urlencoded());
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
  const names = allUsers.map(user => user);
  res.send(names);
});

app.get("/roles", async function(req, res) {
  let statusCode = 400;
  if (!req.headers.token) {
    res.send({ statusCode, error: "token not provided" });
  }
  statusCode = 401;
  const authenticated = await verifyJWT(req.headers.token);
  // only allow super admin or second level admin?
  if (!authenticated.success) {
    if (!!authenticated.error) {
      res.send({ statusCode, error: authenticated.error });
    } else {
      res.send({ statusCode, error: "Unable to Authenticate" });
    }
  } else {
    const { list: rolesList, dict: rolesDict } = global.roles;
    if (
      authenticated.success &&
      rolesDict[rolesList[1]] >= rolesDict[authenticated.userLevel]
    ) {
      statusCode = 200;
      res.send({ statusCode, data: { roles: rolesList } });
    } else {
      res.send({ statusCode, error: "You do not have the role to view this" });
    }
  }
});

app.post("/roleschange", async function(req, res) {
  let statusCode = 400;
  if (!req.headers.token) {
    res.send({ statusCode, error: "token not provided" });
  }
  statusCode = 401;
  const authenticated = verifyJWT(req.headers.token);
  const { dict: rolesDict } = global.roles;
  if (authenticated.success) {
    const { userLevel } = authenticated;
    const { usersToLevelChange } = req.body;
    if (!usersToLevelChange) {
      statusCode = 400;
      res.send({ statusCode, error: "No data provided" });
    } else {
      const failedPromotions = [];
      Object.keys(usersToLevelChange).forEach(async user => {
        const levelToChange = usersToLevelChange[user];
        if (
          !(
            !!rolesDict[levelToChange] &&
            rolesDict[levelToChange] >= rolesDict[userLevel] &&
            ableToFindUser(user)
          )
        ) {
          failedPromotions.push(user);
        }
      });
      if (!!failedPromotions.length) {
        statusCode = 409; // Indicates that the request could not be processed because of conflict in the current state of the resource
        res.send({
          statusCode,
          error:
            "the following users were failed to be granted privileges for the following reason(s): input of incorrect userID / input of incorrect userLevel",
          failedPromotions
        });
      } else {
        Object.keys(usersToLevelChange),
          forEach(async user => {
            levelChange(user, usersToLevelChange[user]);
          });
        statusCode = 200;
        res.send(statusCode, { message: "all user level changes granted" });
      }
    }
  } else {
    if (!!authenticated.error) {
      res.send(statusCode, { error: authenticated.error });
    } else {
      res.send(statusCode, { error: "Unable to Authenticate" });
    }
  }
});

app.get("/put/:level", function(req, res) {
  // var user = new User({ username: 'nithins2', password: "demo", userLevel: req.params.level });
  var user = new User({ username: req.params.name, passord: "demo" });
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
const verifyJWT = async id => {
  User.findById(id, function(err, doc) {
    if (err) {
      return {
        success: false,
        userLevel: "generalUser"
      };
    }
    return {
      success: true,
      userLevel: doc.userLevel
    };
  });
};
const ableToFindUser = async (userID, level) => {
  User.findById(userID, function(err, user) {
    if (err) {
      return false;
    } else {
      return true;
    }
  });
};
const levelChange = async (userID, level) => {
  User.findById(userID, function(err, user) {
    if (err) {
      return { success: false, message: err };
    }
    user.userLevel = level;
    user.save();
    console.log(`${userID} level changed to ${level}`);
    return { success: true };
  });
};
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
const server = app.listen(8000, function() {
  console.log("Listening on http://localhost:8000");
});

module.exports = {
  app,
  server
};
