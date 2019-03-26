// var SECRET_TOKEN = "helga_has_n000000_idea_what_she_doin";
const Token = require("./../models/Token");

async function getSecretToken() {
  console.log("YO");
  const tokens = await Token.find();
  console.log(tokens);
  console.log(tokens.length);
  if (tokens.length == 0) {
    // const token = Math.floor(Math.random() * (100000000 - 100000 + 1)) + 100000;
    const newToken = new Token({
      //   token,
      issued: Date.now()
    });
    await newToken.save();
    console.log(newToken._id);
    return [newToken._id];
  } else if (tokens.length == 1) {
    // if it was issued more than 1 hours ago
    if (Date.now() - tokens[0].issued > 1000 * 60 * 60) {
      // const token = Math.floor(Math.random() * (100000000 - 100000 + 1)) + 100000;
      const newToken = new Token({
        // token,
        issued: Date.now()
      });
      await newToken.save();
      return [newToken._id, tokens[0]._id];
    } else {
      return [tokens[0]._id];
    }
  } else {
    let validToken = null;
    for (let i in tokens) {
      console.log(tokens[i]._id);
      if (Date.now() - tokens[i].issued > 1000 * 60 * 60 * 2) {
        await tokens[i].delete();
      } else {
        validToken = tokens[i];
      }
    }
    const tokens = await Token.find();
    if (tokens.length == 2) {
      if (tokens[0].issued - tokens[1].issued > 0) {
        return [tokens[0]._id, tokens[1]._id];
      } else {
        return [tokens[1]._id, tokens[0]._id];
      }
    } else {
      const newToken = new Token({
        issued: Date.now()
      });
      await newToken.save();
      return [newToken._id, validToken._id];
    }

    //FIX THIS SHIT
    // const newToken = new Token({
    //   // token,
    //   issued: Date.now()
    // });
    // await newToken.save();
    // return [newToken._id, validTokenId];
  }

  //   return SECRET_TOKEN;
}
module.exports = { getSecretToken };
