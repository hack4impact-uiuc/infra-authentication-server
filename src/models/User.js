const mongoose = require("mongoose");
const uri = ""; 
const db = mongoose.createConnection(uri);

const schema = mongoose.Schema({ username: "string" , password: "string"});
const User = db.model("User", schema);

module.exports = User;