const { app, server } = require("../src/App");
const request = require("supertest");
const { mongoose, db } = require("./../src/utils/index");

after(done => {
  server.close();
  mongoose.connection.close();
  done();
});

describe("POST /passwordReset", function() {
  it("respond with json containing a list of all users", async () => {
    const response = await request(app)
      .post("/passwordReset")
      .set("Accept", "application/json")
      .expect(400);
  });
});
