const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const router = require("./api/index");

const app = express();
require("dotenv").config();

// var SECRET_TOKEN = process.env.SECRET_TOKEN;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use("/", router);

module.exports = app;
