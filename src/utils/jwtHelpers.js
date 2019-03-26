const jwt = require("jsonwebtoken");
const { getSecretToken } = require("./secret-token");

async function signAuthJWT(id, password) {
  if (!password || !id) {
    throw "Cannot create hash without both id && password";
  }
  const SECRET_TOKEN = await getSecretToken();
  console.log("SIGNING ");
  console.log(SECRET_TOKEN[0]);
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
    const { userId, hashedPassword } = jwt.verify(
      token,
      String(SECRET_TOKEN[0])
    );
    const valid = userId === id && hashedPassword == password;
    const { otherUserId, otherHashedPassword } = jwt.verify(
      token,
      String(SECRET_TOKEN[1])
    );
    const valid2 = otherUserId === id && otherHashedPassword == password;
    return valid || valid2;
  } catch (err) {
    return false;
  }
}

// Returns the auth JWT if it's valid, else return null if it's invalid
async function decryptAuthJWT(token) {
  try {
    const SECRET_TOKEN = await getSecretToken();
    let { userId } = jwt.verify(token, String(SECRET_TOKEN[0]));
    if (userId) {
      return userId;
    }
    let { otherUserId } = jwt.verify(token, String(SECRET_TOKEN[1]));
    if (otherUserId) {
      return otherUserId;
    }
    return null;
  } catch (err) {
    return null;
  }
}

module.exports = {
  signAuthJWT,
  verifyAuthJWT,
  decryptAuthJWT
};
