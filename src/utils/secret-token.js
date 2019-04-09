// var SECRET_TOKEN = "helga_has_n000000_idea_what_she_doin";
// module.exports = { SECRET_TOKEN };

const Token = require("./../models/Token");

async function createToken() {
  const newToken = new Token({
    issued: Date.now()
  });
  await newToken.save();
  return newToken;
}

async function getSecretToken() {
  const tokens = await Token.find();
  if (tokens.length == 0) {
    const newToken = await createToken();
    return [newToken._id];
  } else if (tokens.length == 1) {
    // if it was issued more than 1 hours ago create a new token, but dont delete the last token
    if (Date.now() - tokens[0].issued > 1000 * 60 * 60) {
      const newToken = await createToken();
      return [newToken._id, tokens[0]._id];
    } else {
      return [tokens[0]._id];
    }
  } else {
    //delete all tokens older than 2 hours
    for (let i in tokens) {
      console.log(tokens[i]._id);
      if (Date.now() - tokens[i].issued > 1000 * 60 * 60 * 2) {
        await tokens[i].delete();
      }
    }
    if (tokens.length == 2) {
      if (tokens[0].issued - tokens[1].issued > 0) {
        return [tokens[0]._id, tokens[1]._id];
      } else {
        return [tokens[1]._id, tokens[0]._id];
      }
    }
    return await getSecretToken();
  }
}
module.exports = { getSecretToken };
