const yaml = require("js-yaml");
const fs = require("fs");

const getConfigFile = async () => {
  return await yaml.safeLoad(
    fs.readFileSync("config/defaultroles.yml", "utf8")
  );
};

const getRolesForUser = async role => {
  const config = await getConfigFile();
  console.log(config);
  if (config["roles"][role] != undefined) {
    return config["roles"][role];
  }
  return null;
};

const getTestURI = async () => {
  const config = await getConfigFile();
  if (config["test_db"] != undefined) {
    return config["test_db"];
  }
  return null;
};

module.exports = {
  getConfigFile,
  getRolesForUser,
  getTestURI
};
