const { app, server } = require("../src/App");
const request = require("supertest");

describe("POST /passwordReset", function() {
  it("respond with json containing a list of all users", function() {
    request(app)
      .post("/passwordReset")
      .set("Accept", "application/json")
      .expect(400);
    console.log(server);
    server.close();
  });
});
