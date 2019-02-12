const mongoose = require("mongoose");
const uri = "mongodb://product:infra28@ds125385.mlab.com:25385/auth-infra"; 
const db = mongoose.createConnection(uri);

const schema = mongoose.Schema({ username: "string" , password: "string"});
const User = db.model("User", schema);

module.exports = User;