const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const morgan = require("morgan");
const User = require("./models/User");
// const { SECRET_TOKEN } = require("./utils/secret-token");
const router = require("./api/index");

const SECRET_TOKEN = "helga_has_n000000_idea_what_she_doin";

const app = express();
require("dotenv").config();

// var SECRET_TOKEN = process.env.SECRET_TOKEN;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use("/", router);

module.exports = {
  app
};
