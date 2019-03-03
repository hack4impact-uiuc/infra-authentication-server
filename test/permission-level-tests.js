const request = require("supertest");
const { app, server } = require("../src/App");
const mongoose = require("mongoose");
const User = require("../src/models/User.js");
const assert = require("assert");
before(done => {
  // Make a DB connection before starting the tests so the first test
  // doesn't throw off timing if doing performance testing
  User.startSession(() => {
    console.log("Successfully started session on port 8000");
    done();
  });
});

after(done => {
  server.close();
  mongoose.connection.close();
  done();
});

describe("get /roles", function() {
  const genUser = new User({
    username: "nrajkum2",
    password: "nithinis",
    userLevel: "generalUser"
  });
  console.log(genUser);
  it("returns a 400 without attaching a token", async () => {
    const response = await request(app)
      .get("/roles")
      .set("Accept", "application/json");
    assert(response.statusCode, 400);
  });
  it("returns the permission levels", async () => {
    const response = await request(app)
      .get("/roles")
      .set({ Accept: "application/json", token: genUser._id });
    assert(response.data.roles);
  });
});
