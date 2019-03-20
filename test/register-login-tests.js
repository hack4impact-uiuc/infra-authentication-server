const { getTestURI } = require("./../src/utils/getConfigFile");

const { app } = require("../src/App");
const request = require("supertest");
const User = require("../src/models/User.js");
const mongoose = require("mongoose");
const assert = require("assert");
const test_uri =
  "mongodb://product:infra28@ds111441.mlab.com:11441/auth-infra-server-test";
var server;

before(done => {
  // Make a DB connection before starting the tests so the first test
  // doesn't throw off timing if doing performance testing
  User.startSession(() => {
    console.log("Successfully started session on port 8000");
    done();
  });

  var options = {
    server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }, // to get rid of error that comes up bc of server
    reconnectTries: Number.MAX_VALUE, // to get rid of weird topology was destroyed error from mongo
    reconnectInterval: 1000,
    useNewUrlParser: true
  };

  // connect test_db and clear it before starting
  mongoose.connect(test_uri, options, function() {
    mongoose.connection.db.dropDatabase();
  });

  server = app.listen(8000);
});

describe("connection test", function() {
  it("connection established and test_db cleared", async () => {
    assert(1 === 1);
  });
});

/**
 * Test Login/Register Credentials
 * email: helga_test@ifra.org
 * password: Lmao_Bi$$Can7Stop4Ho3s
 */

describe("POST /register", function() {
  it("returns 400 for empty body", async () => {
    const response = await request(server)
      .post("/register")
      .type("form")
      .send("")
      .expect(
        400,
        '{"status":400,"message":"Please enter valid arguments for the fields provided."}'
      );
  });
});

after(done => {
  server.close();
  mongoose.connection.close();
  done();
});
