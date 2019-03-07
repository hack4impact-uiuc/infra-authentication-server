const express = require("express");

const cors = require("cors");
var bodyParser = require("body-parser");
const User = require("./models/User");
const fetch = require("node-fetch");
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
      const userIDs = Object.keys(usersToLevelChange);
      for (const userID of userIDs) {
        const levelToChange = usersToLevelChange[userID];
        const userToChange = await ableToFindUser(userID);

        if (
          rolesDict[levelToChange] === undefined ||
          rolesDict[levelToChange] < rolesDict[userLevel] || // user1 is trying to change to user2 to a level above theirs
          !userToChange.success ||
          rolesDict[userLevel] > rolesDict[userToChange.userLevel] // user1 is trying to change user2 of higher level
        ) {
          failedPromotions.push(userID);
        }
      }
      if (failedPromotions.length > 0) {
        status = 409; // Indicates that the request could not be processed because of conflict in the current state of the resource
        res.status(status).send({
          error:
            "the following users were failed to be granted privileges for the following reason(s): input of incorrect userID / input of incorrect userLevel, attempt to level change a user with higher permissions",
          failedPromotions
        });
        return;
      } else {
        Object.keys(usersToLevelChange).forEach(async user => {
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
  await User.findById(userID, function(err, user) {
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
const server = app.listen(8000, function() {
  console.log("Listening on http://localhost:8000");
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

module.exports = {
  app,
  server
};
