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
  const SECRET_TOKEN = await getSecretToken();
  try {
    console.log(SECRET_TOKEN);
    let { userId, hashedPassword } = jwt.verify(token, String(SECRET_TOKEN[0]));
    if (String(userId) === String(id) && hashedPassword == password) {
      return true;
    }
    // if (SECRET_TOKEN.length == 2) {
    //   let { userId, hashedPassword } = jwt.verify(
    //     token,
    //     String(SECRET_TOKEN[1])
    //   );
    //   return (String(userId) === String(id) && hashedPassword == password)
    // }
    // return false;
  } catch (err) {
    // return false;
  }
  try {
    // const SECRET_TOKEN = await getSecretToken();
    console.log(SECRET_TOKEN);
    let { userId, hashedPassword } = jwt.verify(token, String(SECRET_TOKEN[1]));
    if (String(userId) === String(id) && hashedPassword == password) {
      return true;
    }
    // if (SECRET_TOKEN.length == 2) {
    //   let { userId, hashedPassword } = jwt.verify(
    //     token,
    //     String(SECRET_TOKEN[1])
    //   );
    //   return (String(userId) === String(id) && hashedPassword == password)
    // }
    // return false;
  } catch (err) {
    // return false;
  }
  return false;
}

async function shouldUpdateJWT(token, id, password) {
  console.log("YUOOOOO");
  const SECRET_TOKEN = await getSecretToken();
  try {
    let { userId, hashedPassword } = jwt.verify(token, String(SECRET_TOKEN[0]));
    if (String(userId) === String(id) && hashedPassword == password) {
      console.log("FIRT ONE MATCHED");
      return false;
    }

    console.log("WTF");
    return false;
  } catch (err) {
    console.log("ERROR");
    if (SECRET_TOKEN.length > 1) {
      let { userId, hashedPassword } = jwt.verify(
        token,
        String(SECRET_TOKEN[1])
      );
      console.log("SECOND ONE MATCHED");
      return String(userId) === String(id) && hashedPassword == password;
    }
    return false;
  }
}

// Returns the auth JWT if it's valid, else return null if it's invalid
async function decryptAuthJWT(token) {
  const SECRET_TOKEN = await getSecretToken();
  console.log(SECRET_TOKEN);
  try {
    const { userId } = jwt.verify(token, String(SECRET_TOKEN[0]));
    return userId;
  } catch (err) {
    if (SECRET_TOKEN.length == 2) {
      try {
        const SECRET_TOKEN = await getSecretToken();
        const { userId } = jwt.verify(token, String(SECRET_TOKEN[1]));
        return userId;
      } catch (err) {
        return null;
      }
    }
    return null;
  }
}

module.exports = {
  signAuthJWT,
  verifyAuthJWT,
  decryptAuthJWT,
  shouldUpdateJWT
};
