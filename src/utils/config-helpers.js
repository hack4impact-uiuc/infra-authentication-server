/*
*   file format: YAML
    roles:
        heirarchy:
            - superAdmin
            - admin
            - generalUser
            - etc.
*   
*/

/*
    data = {
        roles: {
            heirarchy: [ordered list of roles]
        }
    }
*/
const fs = require("fs");
const yaml = require("js-yaml");

const defaultConfig = "src/config/defaultroles.yml";
/* Enter your own config */
const config = "src/config/roles.yml";

//  () => {success: boolean, roles: {dict: [name]: precedenceValue}, list: []}, error(optional): str}
const parseRolesConfig = contents => {
  const parseRet = {
    success: false,
    roles: { dict: {}, list: [] },
    error: undefined
  };
  try {
    data = yaml.load(contents);
    if (!data.roles) {
      parseRet.error = "No roles in yml config";
      return parseRet;
    }
    const { heirarchy } = data.roles;
    if (!heirarchy) {
      parseRet.error = "No role heirarchy specified";
      return parseRet;
    }
    // heirarchy is an ordered list of the roles (ordered by most precedence to least)
    for (let i = 0; i < heirarchy.length; i++) {
      parseRet.roles.dict[heirarchy[i]] = i - 1;
    }
    parseRet.roles.list = heirarchy;
    parseRet.success = true;
  } catch (err) {
    parseRet.error = err;
  }
  return parseRet;
};

module.exports = {
  parseRolesConfig,
  parseConfig: () => {
    /*
            { parseSuccess: boolean, error: string } 
        */
    let parseRolesConfigRet = { success: false, err: "" };
    let contents;
    try {
      contents = fs.existsSync(config)
        ? fs.readFileSync(config, "utf8")
        : fs.readFileSync(defaultConfig, "utf8");
    } catch (err) {
      parseRolesConfig = { err: err.message };
      return parseRolesConfig;
    }
    parseRolesConfigRet = parseRolesConfig(contents);
    if (!!parseRolesConfigRet.error && !parseRolesConfigRet.success) {
      return { success: false, error: parseRolesConfigRet.error };
    } else {
      global.roles = {
        dict: parseRolesConfigRet.roles.dict,
        list: parseRolesConfigRet.roles.list
      };
    }
    // more parse
    return { success: true, error: "" };
  }
};
