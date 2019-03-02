const { mongoose, db } = require("./../utils/index");

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
