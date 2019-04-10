const router = require("express").Router();
const User = require("../models/User");
const { sendResponse } = require("./../utils/sendResponse");
const { signAuthJWT, shouldUpdateJWT } = require("./../utils/jwtHelpers");
const { googleAuth } = require("./../utils/getConfigFile");
const fetch = require("node-fetch");
const { verifyUser } = require("./../utils/userVerification");

router.post(
  "/verify",
  [
    // check("token")
    //   .isString()
    //   .isLength({ min: 1 })
  ],
  async function(req, res) {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return sendResponse(res, 400, "Invalid request", {
    //     errors: errors.array({ onlyFirstError: true })
    //   });
    // }
    // conol
    // console.log(req.headers.token);

    const useGoogle = await googleAuth();

    if (useGoogle) {
      const tokenInfoRes = await fetch(
        `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${
          req.headers.token
        }`
      );
      const payload = await tokenInfoRes.json();
      const user = await User.findOne({
        email: payload.email,
        googleAuth: true
      });
      if (user) {
        return sendResponse(res, 200, "Google Authenticated");
      } else {
        null;
      }
    }
    const user = await verifyUser(req.headers.token);
    // console.log(user);
    if (user.errorMessage != undefined) {
      console.log(user.errorMesage);
      return sendResponse(res, 400, user.errorMessage);
    }

    // tokenUpdated
    if (await shouldUpdateJWT(req.headers.token, user._id, user.password)) {
      // console.log("TOKEN UPDATED")
      var newToken = await signAuthJWT(user._id, user.password);
      // console.log("NEW TOKEN")
      // console.log(newToken)
      // console.log(req.headers.token)
      // if (String(newToken) !== String(req.headers.token) ) {
      // console.log("HHERE")
      return res.status(200).send({
        status: 200,
        message: "Valid JWT token",
        role: user.role,
        newToken
      });
      // }
    }

    return res.status(200).send({
      status: 200,
      message: "Valid JWT token",
      role: user.role
    });
    // }
  }
);

module.exports = router;
