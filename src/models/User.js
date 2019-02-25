const mongoose = require("mongoose");
const uri = "mongodb://product:infra28@ds125385.mlab.com:25385/auth-infra";
const db = mongoose.connect(uri, { useNewUrlParser: true });

const schema = mongoose.Schema({
  username: "string",
  password: "string",
  email: "string",
  question: "string",
  answer: "string",
  pin: "number",
  expiration: "date"
});
const User = mongoose.model("User", schema);

module.exports = User;
