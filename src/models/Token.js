const { mongoose } = require("./../utils/index");

const schema = mongoose.Schema({
  token: "string",
  issued: "date"
});

const Token = mongoose.model("Token", schema);

module.exports = Token;
