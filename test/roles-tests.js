/* eslint-disable */

const app = require("../src/App");
const request = require("supertest");
const User = require("../test/models/User.js");
const mongoose = require("mongoose");
const assert = require("assert");
const test_uri =
  "mongodb://product:infra28@ds111441.mlab.com:11441/auth-infra-server-test";
let server, token;

const testUser1 = {
  email: "test@test.com",
  password: "Bi$$420",
  role: "supervisor"
};
const testUser2 = {
  email: "test2@test.com",
  password: "Bi$$420",
  role: "admin"
};

const commandUser = {
  email: "nit@nit.com",
  password: "Bi$$420",
  role: "admin"
};

before(async () => {
  // Make a DB connection before starting the tests so the first test
  // doesn't throw off timing if doing performance testing TTFB
  User.startSession();

  var options = {
    useNewUrlParser: true
  };

  // connect test_db and clear it before starting
  await mongoose.connect(test_uri, options);

  await mongoose.connection.db
    .dropDatabase()
    .catch(() => console.log("Trying to drop"));
  server = app.listen(9000);
  // relies on working /register
  // saves users to be used
  await request(app)
    .post("/register")
    .send(testUser1);
  await request(app)
    .post("/register")
    .send(testUser2);
  token = await request(app)
    .post("/register")
    .send(commandUser);
  token = token.body.token;
});

after(async () => {
  // wait for both the server close and the mongoose connection to finish
  await mongoose.connection.db
    .dropDatabase()
    .catch(() => console.log("Trying to drop"));
  await server.close();
  await mongoose.connection.close();
  // await Promise.all([server.close(), mongoose.connection.close()]);
});

describe("connection test", function() {
  it("connection established and test_db cleared", async () => {
    assert(1 === 1);
  });
});

const userToPromoteBadUser = {
  userEmail: "bad@bad.com",
  newRole: "guest"
};

const userToBePromotedBadLevel = {
  userEmail: "test@test.com",
  newRole: "root"
};

const userLevelChangeWorks = {
  userEmail: "test@test.com",
  newRole: "guest"
};

describe("POST /rolesChange", function() {
  it("returns 400 for empty body", async () => {
    const response = await request(app)
      .post("/register")
      .type("form")
      .send("");
    assert.equal(400, response.body.status);
    assert.equal("Invalid Request", response.body.message);
  });

  it("returns 400 for invalid email", async () => {
    const response = await request(app)
      .post("/roleschange")
      .type("form");
    assert.equal(400, response.body.status);
    assert.equal("Invalid Request", response.body.message);
  });

  it("returns 400 for no token", async () => {
    const response = await request(app)
      .post("/roleschange")
      .type("form");
    assert.equal(400, response.body.status);
    assert.equal("Invalid Request", response.body.message);
  });

  it("returns 400 if user to be promoted does not exist", async function() {
    const response = await request(app)
      .post("/roleschange")
      .type("form")
      .set({ token })
      .send(userToPromoteBadUser);
    assert.equal(400, response.body.status);
  }).timeout(2000); // add a longer timeout since there's a lot that has to get done when adding a user
  it("returns 400 if user to be promoted has an improper level", async function() {
    const response = await request(app)
      .post("/roleschange")
      .type("form")
      .set({ token })
      .send(userToBePromotedBadLevel);
    assert.equal(400, response.body.status);
  });
  it("returns 200", async function() {
    const response = await request(app)
      .post("/roleschange")
      .type("form")
      .set({ token })
      .send(userLevelChangeWorks);
    assert.equal(200, response.body.status);
  });
});
