// const { app, server } = require("../src/App");
// const request = require("supertest");
// const User = require("../src/models/User.js");
// const { mongoose, db } = require("./../src/utils/index");

// before(done => {
//   // Make a DB connection before starting the tests so the first test
//   // doesn't throw off timing if doing performance testing
//   User.startSession(() => {
//     console.log("Successfully started session on port 8000");
//     done();
//   });
// });

// after(done => {
//   server.close();
//   mongoose.connection.close();
//   done();
// });

// describe("POST /forgotPassword", function() {
//   it("returns 400 on an empty body", async () => {
//     const response = await request(server)
//       .post("/forgotPassword")
//       .type("form")
//       .send("")
//       .expect(400, /malformed request/gi);
//   });
//   it("returns 400 on missing required information", async () => {
//     const response = await request(server)
//       .post("/forgotPassword")
//       .type("form")
//       .send("abc=def")
//       .expect(400, /malformed request/gi);
//   });
//   it("returns 400 on invalid email lookup", async () => {
//     const response = await request(server)
//       .post("/forgotPassword")
//       .type("form")
//       .send("email=userthatdoesntexist@notgmail.com")
//       .expect(400, /"status":400.+User does not exist/gi);
//   });
//   it("returns 400 on no answer specified in the request", async () => {
//     const response = await request(server)
//       .post("/forgotPassword")
//       .type("form")
//       .send("email=nosecurityq@example.com")
//       .expect(400, /"status":400.+No answer sent/gi);
//   });
//   it("returns 400 on no answer specified in the DB", async () => {
//     const response = await request(server)
//       .post("/forgotPassword")
//       .type("form")
//       .send("email=nosecurityq@example.com")
//       .send("answer=test")
//       .expect(400, /"status":400.+No answer specified in the DB/gi);
//   });
// });

// describe("POST /passwordReset", function() {
//   it("returns 400 on an empty body", async () => {
//     const response = await request(server)
//       .post("/passwordReset")
//       .type("form")
//       .send("")
//       .expect(400, /malformed request/gi);
//   });
//   it("returns 400 on missing required information", async () => {
//     const response = await request(server)
//       .post("/passwordReset")
//       .type("form")
//       .send("abc=def")
//       .expect(400, /malformed request/gi);
//   });
//   it("returns 400 on invalid email lookup", async () => {
//     const response = await request(server)
//       .post("/passwordReset")
//       .type("form")
//       .send("email=userthatdoesntexist@notgmail.com")
//       .expect(400, /"status":400.+User does not exist/gi);
//   });
//   it("returns 400 on invalid PIN", async () => {
//     const response = await request(server)
//       .post("/passwordReset")
//       .type("form")
//       .send("email=nosecurityq@example.com")
//       .send("pin=1235")
//       .expect(400, /"status":400.+PIN does not match/gi);
//   });
//   it("returns 400 if the PIN is valid but expired", async () => {
//     const response = await request(server)
//       .post("/passwordReset")
//       .type("form")
//       .send("email=nosecurityq@example.com")
//       .send("pin=1234")
//       .expect(400, /"status":400.+PIN is expired/gi);
//   });
// });

// describe("GET /getSecurityQuestion", function() {
//   it("returns 400 on an empty body", async () => {
//     const response = await request(server)
//       .get("/getSecurityQuestion")
//       .set("Accept", "application/json")
//       .expect(400);
//   });

//   it("returns 400 on an invalid email address", async () => {
//     const response = await request(server)
//       .get("/getSecurityQuestion")
//       .type("form")
//       .send("email=joshb1050@gmail.coms")
//       // here we add a regular expression that checks the status code, then says
//       // there's some arbitrary amount of characters before asserting that there's the phrase
//       // "does not exist"
//       .expect(400, /"status":400.+does not exist/gi);
//   });

//   it("returns 400 on a user without security question set", async () => {
//     const response = await request(server)
//       .get("/getSecurityQuestion")
//       .type("form")
//       .send("email=nosecurityq@example.com")
//       .expect(400, /"status":400.+No security question set/gi);
//   });

//   it("returns 200 for a user with a valid email address", async () => {
//     const response = await request(server)
//       .get("/getSecurityQuestion")
//       .type("form")
//       .send("email=joshb1050@gmail.com")
//       .expect(200, /"status":200.+"question":"what/gi);
//   });
// });
