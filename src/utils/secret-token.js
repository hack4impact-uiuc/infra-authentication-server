var SECRET_TOKEN = "helga_has_n000000_idea_what_she_doin";
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
      console.log("HERE");
      console.log([newToken._id, tokens[0]._id]);
      return [newToken._id, tokens[0]._id];
    } else {
      console.log("YOgjvbkjlnk");
      console.log(tokens[0]._id);
      return [tokens[0]._id];
    }
  } else {
    for (let i in tokens) {
      console.log(tokens[i]._id);
    }
  }

  return SECRET_TOKEN;
}
module.exports = { getSecretToken };
