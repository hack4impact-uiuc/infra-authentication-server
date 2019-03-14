const yaml = require("js-yaml");
const fs = require("fs");

const getConfigFile = async () => {
  return await yaml.safeLoad(
    fs.readFileSync("src/config/defaultroles.yml", "utf8")
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

const googleAuth = async () => {
  const config = await getConfigFile();
  return config["useGoogleAuth"];
};

module.exports = {
  getConfigFile,
  getRolesForUser,
  googleAuth
};
