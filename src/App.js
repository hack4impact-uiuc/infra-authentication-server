const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Item = require("./models/Item");

const app = express();
app.use(cors());

app.get("/", function(req, res) {
  res.send("Hello World");
});

app.get("/items", async function(req, res) {
  const allItems = await Item.find();
  const names = allItems.map(item => item.name);
  res.send(names);
});

app.get("/put/:name", function(req, res) {
  var item = new Item({ name: req.params.name });
  item.save();
  console.log("Added Item " + req.params.name);
  res.send("Added Item " + req.params.name);
});

app.listen(8000, function() {
  console.log("Listening on http://localhost:8000");
});