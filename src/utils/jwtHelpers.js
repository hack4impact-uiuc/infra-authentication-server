const jwt = require("jsonwebtoken");
const { getSecretToken } = require("./secret-token");

async function signAuthJWT(id, password) {
  if (!password || !id) {
    throw "Cannot create hash without both id && password";
  }
  const SECRET_TOKEN = await getSecretToken();
  console.log(SECRET_TOKEN);
  return jwt.sign(
    { userId: id, hashedPassword: password },
    String(SECRET_TOKEN[0]),
    {
      expiresIn: "1d"
    }
  );
}

// Return true if the JWT is valid and matches the parameters
async function verifyAuthJWT(token, id, password) {
  try {
    const SECRET_TOKEN = await getSecretToken();
    console.log(SECRET_TOKEN);
    const { userId, hashedPassword } = jwt.verify(
      token,
      String(SECRET_TOKEN[0])
    );
    return userId === id && hashedPassword == password;
  } catch (err) {
    return false;
  }
}

// Returns the auth JWT if it's valid, else return null if it's invalid
async function decryptAuthJWT(token) {
  try {
    const SECRET_TOKEN = await getSecretToken();
    const { userId } = jwt.verify(token, String(SECRET_TOKEN[0]));
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
