const { mongoose, db } = require("./../utils/index");

const schema = mongoose.Schema({
  username: "string",
  password: "string",
  email: "string",
  question: "string",
  answer: "string",
  pin: "number",
  expiration: "date",
  userLevel: "string",
  googleAuth: "boolean"
});

const User = mongoose.model("User", schema);

module.exports = User;
