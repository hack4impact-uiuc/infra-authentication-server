/* eslint-disable */

const app = require("../src/App");
const request = require("supertest");
const User = require("../src/models/User.js");
const mongoose = require("mongoose");
const assert = require("assert");
const test_uri =
  "mongodb://product:infra28@ds111441.mlab.com:11441/auth-infra-server-test";
let server;

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
  server = app.listen(8000);
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

/**
 * Test Login/Register Credentials
 * email: helga_test@ifra.org
 * password: 69biss_cant_stop_dis_hoe420tZ
 */
const valid_register_test = {
  email: "helga_test@infra.org",
  password: "69biss_cant_stop_dis_hoe420",
  role: "guest"
};

describe("POST /register", function() {
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
      .post("/register")
      .type("form")
      .send("email=093j");
    assert.equal(400, response.body.status);
    assert.equal("Invalid Request", response.body.message);
  });

  it("returns 400 for no password", async () => {
    const response = await request(app)
      .post("/register")
      .type("form")
      .send("email=helga_test@infra.org");
    assert.equal(400, response.body.status);
    assert.equal("Invalid Request", response.body.message);
  });

  it("returns 200 for valid user", async function() {
    const response = await request(app)
      .post("/register")
      .type("form")
      .send(valid_register_test);
    assert.equal(200, response.body.status);
    assert.equal("User added successfully!", response.body.message);
  }).timeout(5000); // add a longer timeout since there's a lot that has to get done when adding a user
});

const valid_login_test = {
  email: "helga_test@infra.org",
  password: "69biss_cant_stop_dis_hoe420"
};

const user_doesnt_exist = {
  email: "helga@infra.org",
  password: "69biss_cant_stop_dis_hoe420"
};

const wrong_pass = {
  email: "helga_test@infra.org",
  password: "bissssss6969"
};

describe("POST /login", function() {
  it("returns 400 for no input", async () => {
    const response = await request(app)
      .post("/login")
      .type("form")
      .send("");
    assert.equal(400, response.body.status);
    assert.equal("Invalid Request", response.body.message);
  });

  it("returns 400 for no such user in database", async () => {
    const response = await request(app)
      .post("/login")
      .type("form")
      .send(user_doesnt_exist);
    assert.equal(400, response.body.status);
    assert.equal(
      "The information you provided does not match our database. Please check your inputs again.",
      response.body.message
    );
  });

  it("returns 400 for wrong password", async () => {
    const response = await request(app)
      .post("/login")
      .type("form")
      .send(wrong_pass);
    assert.equal(400, response.body.status);
    assert.equal(
      "Password incorrect. Please try again.",
      response.body.message
    );
  });

  it("returns 200 for successful login", async () => {
    const response = await request(app)
      .post("/login")
      .type("form")
      .send(valid_login_test);
    // .expect(200, '{"status":200,"message":"Successful login!"}');
    assert.equal(200, response.body.status);
    assert.equal("Successful login!", response.body.message);
  });
});
