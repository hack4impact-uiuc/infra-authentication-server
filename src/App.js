const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

const User = require("./models/User");
const router = require("./api/index");

const SECRET_TOKEN = "helga_has_n000000_idea_what_she_doin";

const app = express();
require("dotenv").config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", router);

module.exports = {
  app
};
