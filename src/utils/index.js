const mongoose = require("mongoose");
const uri = "mongodb://product:infra28@ds125385.mlab.com:25385/auth-infra";
const db = mongoose.connect(uri, { useNewUrlParser: true });

module.exports = {
  db,
  mongoose
};
