const router = require("express").Router();
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator/check");
const User = require("../models/User");
const { sendResponse } = require("./../utils/sendResponse");
const { getRolesForUser } = require("./../utils/getConfigFile");
const { signAuthJWT } = require("../utils/jwtHelpers");
const { generatePIN } = require("../utils/pinHelpers");
const { isGmailEnabled } = require("../utils/getConfigFile");
const { sendMail } = require("./../utils/sendMail");
router.post(
  "/register",
  [
    check("email").isEmail(),
    check("password")
      .isString()
      .isLength({ min: 1 }),
    check("role")
      .isString()
      .isLength({ min: 1 })
  ],
  async function(req, res) {
    // Input validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendResponse(res, 400, "Invalid Request", {
        errors: errors.array({ onlyFirstError: true })
      });
    }

    const usingGmail = await isGmailEnabled();
    if (await User.findOne({ email: req.body.email })) {
      return sendResponse(res, 400, "User already exists. Please try again.");
    }

    const encodedPassword = await bcrypt.hash(req.body.password, 10);

    const userData = {
      email: req.body.email,
      password: encodedPassword,
      role: req.body.role,
      verified: false
    };
    const user = new User(userData);
    const requiredAuthFrom = await getRolesForUser(req.body.role);

    if (requiredAuthFrom != null) {
      return sendResponse(
        res,
        400,
        "User needs a higher permission level for that role"
      );
    }

    const jwt_token = signAuthJWT(user._id, user.password);
    if (usingGmail) {
      // using gmail so it should send generate a PIN and send a verification email.
      generatePIN(user);
      const body = {
        from: "hack4impact.infra@gmail.com",
        to: user.email,
        subject: "New User Verification",
        text:
          "Thanks for signing up! Please enter the following PIN on the new user confirmation page" +
          user.pin
      };
      try {
        await sendMail(body);
      } catch (e) {
        return sendResponse(
          res,
          500,
          "Verification email could not be sent despite Gmail being enabled. User not added to DB"
        );
      }
    }

    // success, so save the user to the DB and send back the JWT
    await user.save();
    return res.status(200).send({
      status: 200,
      message: "User added successfully!",
      token: jwt_token,
      uid: user._id,
      permission: user.role
    });
  }
);

module.exports = router;
