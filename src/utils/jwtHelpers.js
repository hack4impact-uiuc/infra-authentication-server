const jwt = require("jsonwebtoken");
const { SECRET_TOKEN } = require("./secret-token");

function signAuthJWT(id, password) {
  if (!password || !id) {
    throw "Cannot create hash without both id && password";
  }
  return jwt.sign({ userId: id, hashedPassword: password }, SECRET_TOKEN, {
    expiresIn: "1d"
  });
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
  verifyAuthJWT,
  decryptAuthJWT
};
