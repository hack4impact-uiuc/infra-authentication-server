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
  let status = 400;
  if (!req.headers.token) {
    res.status(status).send({ status, error: "token not provided" });
    return;
  }
  status = 401;
  const authenticated = await verifyJWT(req.headers.token);
  // only allow super admin or second level admin?

  if (!authenticated.success) {
    if (!!authenticated.error) {
      res.status(status).send({ error: authenticated.error });
      return;
    } else {
      res.status(status).send({ status, error: "Unable to Authenticate" });
      return;
    }
  } else {
    const { list: rolesList, dict: rolesDict } = global.roles;
    if (rolesDict["admin"] >= rolesDict[authenticated.userLevel]) {
      status = 200;
      res.status(status).send({ status, data: { roles: rolesList } });
      return;
    } else {
      res
        .status(status)
        .send({ error: "You do not have the role to view this" });
      return;
    }
  }
});

app.post("/roleschange", async function(req, res) {
  let status = 400;
  if (!req.headers.token) {
    res.status(status).send({ error: "token not provided" });
    return;
  }
  status = 401;
  const authenticated = await verifyJWT(req.headers.token);
  const { dict: rolesDict } = global.roles;
  if (authenticated.success) {
    const { userLevel } = authenticated;
    const { usersToLevelChange } = req.body;
    if (!usersToLevelChange) {
      status = 400;
      res.status(status).send({ error: "No data provided" });
      return;
    } else {
      const failedPromotions = [];
      Object.keys(usersToLevelChange).forEach(async userID => {
        const levelToChange = usersToLevelChange[userID];
        const userToChange = ableToFindUser(userID);
        if (
          !rolesDict[levelToChange] ||
          rolesDict[levelToChange] >= rolesDict[userLevel] ||
          !userToChange.success ||
          rolesDict[userLevel] > rolesDict[userToChange.userLevel]
        ) {
          failedPromotions.push(userID);
        }
      });
      if (!!failedPromotions.length) {
        status = 409; // Indicates that the request could not be processed because of conflict in the current state of the resource
        res.status(status).send({
          error:
            "the following users were failed to be granted privileges for the following reason(s): input of incorrect userID / input of incorrect userLevel, attempt to level change a user with higher permissions",
          failedPromotions
        });
        return;
      } else {
        Object.keys(usersToLevelChange),
          forEach(async user => {
            levelChange(user, usersToLevelChange[user]);
          });
        status = 200;
        res.status(status).send({ message: "all user level changes granted" });
        return;
      }
    }
  } else {
    if (!!authenticated.error) {
      res.status(status).send({ error: authenticated.error });
      return;
    } else {
      res.status(status).send({ error: "Unable to Authenticate" });
      return;
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
  // uses ID for now because there is no token generated
  let verifyRet = {};
  await User.findById(id, function(err, doc) {
    if (err) {
      verifyRet = {
        success: false,
        userLevel: "generalUser"
      };
      return;
    }
    if (doc === null) {
      verifyRet = {
        success: false
      };
      return;
    }
    verifyRet = {
      success: true,
      userLevel: doc.userLevel
    };
    return;
  }).catch(error => {
    verifyRet = {
      success: false,
      error
    };
    return;
  });
  return verifyRet;
};
const ableToFindUser = async (userID, level) => {
  let findRet = { success: false };
  User.findById(userID, function(err, user) {
    if (err) {
      findRet.error = err;
      return;
    } else {
      findRet = { success: true, userLevel: user.userLevel };
      return;
    }
  });
  return findRet;
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
