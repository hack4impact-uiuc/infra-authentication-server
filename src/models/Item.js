const mongoose = require("mongoose");
const uri = ""; //replace with your own mlab uri
const db = mongoose.createConnection(uri);

const schema = mongoose.Schema({ name: "string" });
const Item = db.model("Item", schema);

module.exports = Item;