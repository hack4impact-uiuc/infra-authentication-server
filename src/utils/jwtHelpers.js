const jwt = require("jsonwebtoken");
const exjwt = require("express-jwt");
const { SECRET_TOKEN } = require("./secret-token");

function signAuthJWT(id, password) {
  return jwt.sign({ userId: id, hashedPassword: password }, SECRET_TOKEN, {
    expiresIn: "1d"
  });
}

function hashPassword(password) {
  return jwt.sign({ password: password }, SECRET_TOKEN);
}

// verify the hashed password, returning true if it matches
function verifyPasswordHash(hashed, real) {
  try {
    const { password } = jwt.verify(hashed, SECRET_TOKEN);
    return password == real;
  } catch (err) {
    return false;
  }
}

// Return true if the JWT is valid and matches the parameters
function verifyAuthJWT(token, id, password) {
  try {
    const { userId, hashedPassword } = jwt.verify(token, SECRET_TOKEN);
    return userId === id && hashedPassword == password;
  } catch (err) {
    return false;
  }
}

// Returns the auth JWT if it's valid, else return null if it's invalid
function decryptAuthJWT(token) {
  try {
    const { userId } = jwt.verify(token, SECRET_TOKEN);
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
