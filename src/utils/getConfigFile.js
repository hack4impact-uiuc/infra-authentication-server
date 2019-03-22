const yaml = require("js-yaml");
const fs = require("fs");

const getConfigFile = async () => {
  /* we use __dirname because ncc (Zeit's now compiler) only supports
   * requiring files in this fashion. If https://github.com/zeit/ncc/issues/216 resolves,
   * we may be able to do this another way.
   */
  return await yaml.safeLoad(
    fs.readFileSync(__dirname + "/../../config/defaultroles.yml", "utf8")
  );
};

const getRolesForUser = async role => {
  const config = await getConfigFile();
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

const googleAuth = async () => {
  const config = await getConfigFile();
  if (config["useGoogleAuth"] === undefined) {
    return true;
  }
  return config["useGoogleAuth"];
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
  getTestURI,
  googleAuth,
  isSecurityQuestionEnabled,
  isGmailEnabled
};
