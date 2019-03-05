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

const adminUser = new User({
  username: "nrajkum2",
  password: "nithinis",
  userLevel: "admin"
});
adminUser.save();
const genUser = new User({
  username: "nrajkum2_2",
  password: "nithinis",
  userLevel: "generalUser"
});
genUser.save();

describe("get /roles", function() {
  it("returns a 400 without attaching a token", async () => {
    const response = await request(app)
      .get("/roles")
      .set("Accept", "application/json");
    assert(
      response.statusCode === 400,
      !!response.body.error ? response.body.error : "success"
    );
  });
  it("returns the permission levels", async () => {
    const response = await request(app)
      .get("/roles")
      .set({ Accept: "application/json", token: adminUser._id });
    const roles = ["superAdmin", "admin", "orgUser", "generalUser"];
    response.body.data.roles.forEach((role, idx) => {
      assert(
        role === roles[idx],
        !!response.body.error ? response.body.error : "success"
      );
    });
  });
  it("does not return permission level because user is not admin", async () => {
    const response = await request(app)
      .get("/roles")
      .set({ Accept: "application/json", token: genUser._id });
    assert(
      response.statusCode === 401,
      !!response.body.error ? response.body.error : "success"
    );
  });
});

describe("post /roleschange", function() {
  it("returns 400 without attaching a token", async () => {
    const response = await request(app)
      .post("/roleschange")
      .set("Accept", "application/json");
    assert(
      response.statusCode === 400,
      !!response.body.error ? response.body.error : "success"
    );
  });
  it("returns 400 without attaching a body", async () => {
    const response = await request(app)
      .post("/roleschange")
      .set({ Accept: "application/json", token: genUser._id });
    assert(
      response.statusCode === 400,
      !!response.body.error ? response.body.error : "success"
    );
  });
  it("user with lesser clearance tries to change other user with higher clearance", async () => {
    const response = await request(app)
      .post("/roleschange")
      .send({ usersToLevelChange: { [`${adminUser._id}`]: "admin" } })
      .set({ Accept: "application/json", token: genUser._id });
    assert(
      response.statusCode === 409,
      !!response.body.error ? response.body.error : "success"
    );
  });
  it("user tries to change other user to permission level which does not exist", async () => {
    const response = await request(app)
      .post("/roleschange")
      .send({ usersToLevelChange: { [`${genUser._id}`]: "admin2" } })
      .set({ Accept: "application/json", token: adminUser._id });
    assert(
      response.statusCode === 409,
      !!response.body.error ? response.body.error : "success"
    );
  });
  it("user changes level of user to admin", async () => {
    const response = await request(app)
      .post("/roleschange")
      .send({ usersToLevelChange: { [`${genUser._id}`]: "admin" } })
      .set({ Accept: "application/json", token: adminUser._id });
    assert(
      response.statusCode === 200,
      !!response.body.error ? response.body.error : "success"
    );
  });
});
