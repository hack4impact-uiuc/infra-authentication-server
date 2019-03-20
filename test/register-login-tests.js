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
    server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }, // ahh server makes the error come up again but this doesnt help apparently
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
 * password: 69biss_cant_stop_dis_hoe420
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
      .send("")
      .expect(
        400,
        '{"status":400,"message":"Please enter valid arguments for the fields provided."}'
      );
  });

  it("returns 400 for invalid email", async () => {
    const response = await request(app)
      .post("/register")
      .type("form")
      .send("email=093j")
      .expect(
        400,
        '{"status":400,"message":"Please enter valid arguments for the fields provided."}'
      );
  });

  it("returns 400 for no password", async () => {
    const response = await request(app)
      .post("/register")
      .type("form")
      .send("email=helga_test@infra.org")
      .expect(
        400,
        '{"status":400,"message":"Please enter valid arguments for the fields provided."}'
      );
  });

  it("returns 200 for valid user", async () => {
    const response = await request(app)
      .post("/register")
      .type("form")
      .send(valid_register_test);

    // doing this instead of *expect* bc *expect* expects the complete response and doesn't check for only parts of it
    assert(200 === response.body.status);
    assert("User added successfully!" === response.body.message);
  });
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
      .send("")
      .expect(
        400,
        '{"status":400,"message":"Please enter valid arguments for the fields provided."}'
      );
  });

  it("returns 400 for no such user in database", async () => {
    const response = await request(app)
      .post("/login")
      .type("form")
      .send(user_doesnt_exist)
      .expect(
        400,
        '{"status":400,"message":"The information you provided does not match our database. Please check your inputs again."}'
      );
  });

  it("returns 400 for wrong password", async () => {
    const response = await request(app)
      .post("/login")
      .type("form")
      .send(wrong_pass)
      .expect(
        400,
        '{"status":400,"message":"Password incorrect. Please try again."}'
      );
  });

  it("returns 200 for successful login", async () => {
    const response = await request(app)
      .post("/login")
      .type("form")
      .send(valid_login_test);
    // .expect(200, '{"status":200,"message":"Successful login!"}');
    assert(200 === response.body.status);
    assert("Successful login!" === response.body.message);
  });
});

after(done => {
  server.close();
  mongoose.connection.close();
  done();
});