const { getTestURI } = require("./../src/utils/getConfigFile");

const { app } = require("../src/App");
const request = require("supertest");
const User = require("../src/models/User.js");
const mongoose = require("mongoose");
const assert = require("assert");
const test_uri =
  "mongodb://product:infra28@ds111441.mlab.com:11441/auth-infra-server-test";
// connect mongoose to test_uri
// const test_db = mongoose.connect(test_uri, { useNewUrlParser: true });

before(done => {
  // Make a DB connection before starting the tests so the first test
  // doesn't throw off timing if doing performance testing
  User.startSession(() => {
    console.log("Successfully started session on port 8000");
    done();
  });

  // connect mongoose to test_uri
  const test_db = mongoose.connect(test_uri, { useNewUrlParser: true });

  // drop db
  mongoose.connect(test_uri, function() {
    mongoose.connection.db.dropDatabase();
  });
});

describe("get /popo", function() {
  it("passes my boi", async () => {
    assert(1 === 1);
  });
});

after(done => {
  mongoose.connection.close();
  done();
});
