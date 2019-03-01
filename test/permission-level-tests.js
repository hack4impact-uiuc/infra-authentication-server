// const request = require('supertest')
// const { app, server } = require('../src/App')

// after(done => {
//     server.close();
//     mongoose.connection.close();
//     done();
// });

// describe("get /roles", function () {
//     it("returns a 401 without attaching a token", async () => {
//         const response = await request(app)
//             .get("/roles")
//             .set("Accept", "application/json")
//             .expect(401);
//         assert(response.statusCode, 401)
//     });
//     it("returns the permission levels", async () => {
//         const response = await request(app)
//             .get("/roles")
//             .set({Accept: "application/json", token: 'boiboi'})
//             .expect(global.roles.list);
//         assert(response.data.roles)
//     });
// });
