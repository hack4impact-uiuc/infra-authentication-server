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

const isSecurityQuestionEnabled = async () => {
  const config = await getConfigFile();
  if (config["gmail"] != true && config["security_question"] != true) {
    throw "Must have at least one of Gmail and security question enabled";
  }
  if (config["security_question"] === undefined) {
    return true;
  }
  return config["security_question"];
};

const isGmailEnabled = async () => {
  const config = await getConfigFile();
  if (config["gmail"] != true && config["security_question"] != true) {
    throw "Must have at least one of Gmail and security question enabled";
  }
  if (config["gmail"] === undefined) {
    return false;
  }

  return config["gmail"];
};

module.exports = {
  getConfigFile,
  getRolesForUser,
  isSecurityQuestionEnabled,
  isGmailEnabled
};
