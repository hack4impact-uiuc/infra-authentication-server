const mongoose = require("mongoose");
const app = require("./App");
const uri = "mongodb://product:infra28@ds125385.mlab.com:25385/auth-infra";
const db = mongoose.connect(uri, { useNewUrlParser: true });
const server = app.listen(8000, function() {
  console.log("Listening on http://localhost:8000");
});

module.exports.default = server;
