const jwt = require("jsonwebtoken");
const exjwt = require("express-jwt");
const { SECRET_TOKEN } = require("./secret-token");

function signAuthJWT(id) {
  return jwt.sign({ userId: id }, SECRET_TOKEN, { expiresIn: "1d" });
}

function hashPassword(password) {
  return jwt.sign({ password: password }, SECRET_TOKEN);
}

// verify the hashed password, returning true if it matches
function verifyPasswordHash(hashed, real) {
  try {
    jwt.verify(hashed, SECRET_TOKEN, { password: real });
    return true;
  } catch (err) {
    return false;
  }
}

// Return true if the JWT is valid
function verifyAuthJWT(token, id) {
  try {
    jwt.verify(token, SECRET_TOKEN, { userId: id });
    return true;
  } catch (err) {
    return false;
  }
}

// Returns the auth JWT if it's valid, else return null if it's invalid
function decryptAuthJWT(token) {
  try {
    const { userId } = jwt.decode(token, SECRET_TOKEN);
    return userId;
  } catch (err) {
    return null;
  }
}

module.exports = {
  signAuthJWT,
  hashPassword,
  verifyPasswordHash,
  verifyAuthJWT,
  decryptAuthJWT
};
