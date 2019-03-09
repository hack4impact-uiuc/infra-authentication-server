// const { parseRolesConfig } = require("../src/utils/config-helpers");
// const assert = require("assert");
// const fs = require("fs");
// describe("persmissions file parser", function() {
//   it("checks that default config returns expected data structure", function() {
//     const contents = fs.existsSync("src/config/defaultroles.yml")
//       ? fs.readFileSync("src/config/defaultroles.yml", "utf8")
//       : assert(false, "defaultroles.yml file does not exist");
//     const resp = parseRolesConfig(contents);
//     if (!resp.success) {
//       assert(false, resp.error); // failed to parse
//     }
//     const rolesDict = JSON.stringify(resp.roles.dict);
//     const dictTruth = {
//       superAdmin: -1,
//       admin: 0,
//       generalUser: 1
//     };
//     const listTruth = ["superAdmin", "admin", "generalUser"];
//     assert(
//       rolesDict === JSON.stringify(dictTruth),
//       "assertion that proper dictionary is created"
//     );
//     listTruth.forEach((role, idx) => {
//       const globalVarRole = resp.roles.list[idx];
//       assert(globalVarRole === role, "assertion that global variable has");
//     });
//   });
//   it("checks that custom config returns expected data structure", function() {
//     const contents = fs.existsSync("src/config/roles.yml")
//       ? fs.readFileSync("src/config/roles.yml", "utf8")
//       : assert(false, "roles.yml file does not exist");
//     const resp = parseRolesConfig(contents);
//     if (!resp.success) {
//       assert(false, resp.error); // failed to parse
//     }
//     const rolesDict = JSON.stringify(resp.roles.dict);
//     const dictTruth = {
//       superAdmin: -1,
//       admin: 0,
//       orgUser: 1,
//       generalUser: 2
//     };
//     const listTruth = ["superAdmin", "admin", "orgUser", "generalUser"];
//     assert(
//       rolesDict === JSON.stringify(dictTruth),
//       "assertion that proper dictionary is created"
//     );
//     listTruth.forEach((role, idx) => {
//       const globalVarRole = resp.roles.list[idx];
//       assert(globalVarRole === role, "assertion that global variable has");
//     });
//   });
// });
