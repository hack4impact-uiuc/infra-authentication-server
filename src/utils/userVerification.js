const User = require("../models/User");
const { decryptAuthJWT } = require("./jwtHelpers");

async function verifyUser(token) {
  if (!token) {
    return { errorMessage: "Token not provided" };
  }
  const userId = await decryptAuthJWT(token);
  console.log(userId);
  if (userId === null) {
    return { errorMessage: "Invalid Token" };
  }
  const user = await User.findById(userId);
  if (!user) {
    return { errorMessage: "User does not exist in the database" };
  }
  //   if (user.verified == false) {
  //     return {errorMessage: "User not verified"}
  //   }
  return user;
}

module.exports = {
  verifyUser
};
