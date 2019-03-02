/*
import {fetch} from 'node-fetch';
import {jwt} from 'jsonwebtoken';
import {jwt_decode} from 'jwt-decode'; 
*/

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser")
const User = require("./models/User");

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

  addUser = true
  const allUsers = await User.find()
  allUsers.forEach(function(user) {
    if (user.email === req.body.email && user.googleAuth){
      console.log("Welcome back " + user.username)
      user.tokenId = req.body.tokenId
      res.send("Welcome back " + user.username)
      addUser = false
    }
  })
  
  if(addUser){
    const user = new User(req.body);
    await user.save().then(user => {
      console.log("Google user added successfully");
    });
    res.send("email: " + req.body.email);
  }
});

app.listen(8000, function() {
  console.log("Listening on http://localhost:8000");
});

/*
const getaccountFromGoogleToken = async (tokenId) => {
    const tokenInfoRes = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${tokenId}`);
    const payload = await tokenInfoRes.json();

    const [student, teacher] = await Promise.all([Student, Teacher].map(x => x.findOne({ email: payload.email })));
    return { existing: student || teacher, payload };
};

app.post('/auth/google', async (req, res) => {
    try {
        const { tokenId, role, accessToken } = req.body;
        const { existing, payload } = await getaccountFromGoogleToken(tokenId);

        if (role === 'student') {
            const student = await addStudent(payload.name, payload.email, tokenId);
            const id = toGlobalId('Student', student._id);
            const ret = {
                id, name: student.name, email: student.email, gapi_access_token: accessToken, userType: 'student', tokenId,
            };

            // TODO: store secret key in .env file!!!
            const token = jwt.sign(ret, 'secret', { expiresIn: '3 hours' });
            res.json({ role: 'student', data: ret, token });
        }
    } catch (e) {
        console.trace(e);
    }
});

*/